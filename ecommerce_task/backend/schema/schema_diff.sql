
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins
(
    id SERIAL PRIMARY KEY,
    email character varying(255) NOT NULL unique,
    password text NOT NULL,
    role character varying(50)  DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
   
);


CREATE OR REPLACE FUNCTION admin_login(
    p_username TEXT,
    p_password TEXT
)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Try to find a matching user with MD5 password check
    SELECT * INTO user_record
    FROM admins
    WHERE email = p_username
      AND password = MD5(p_password);

    -- If no match found, return error JSON
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;

    -- If match found, return success JSON with user info
    RETURN json_build_object(
        'success', true,
        'message', 'Login successful',
        'user_id', user_record.id,
        'email', user_record.email,
        'role', user_record.role
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION admin_create_product(
    p_session_id TEXT,
    p_name TEXT,
    p_description TEXT,
    p_price NUMERIC,
    p_sku TEXT,
    p_availability BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    new_id INT;
BEGIN
    INSERT INTO products(name, description, price, sku, availability)
    VALUES (p_name, p_description, p_price, p_sku, p_availability)
    RETURNING id INTO new_id;

    RETURN json_build_object(
        'success', true,
        'message', 'Product created successfully',
        'product_id', new_id
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'SKU already exists'
        );
    WHEN others THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Error creating product'
        );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION admin_add_product_image(
    p_session_id TEXT,
    p_product_id INT,
    p_image_url TEXT
)
RETURNS JSON AS $$
BEGIN
    INSERT INTO product_images(product_id, image_url)
    VALUES (p_product_id, p_image_url);

    RETURN json_build_object(
        'success', true,
        'message', 'Image added successfully',
        'product_id', p_product_id,
        'image_url', p_image_url
    );
EXCEPTION
    WHEN foreign_key_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid product ID'
        );
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION admin_delete_product(
    p_session_id TEXT,
    p_product_id INT
)
RETURNS JSON AS $$
BEGIN
    -- First delete images for this product (if not using ON DELETE CASCADE)
    DELETE FROM product_images WHERE product_id = p_product_id;

    -- Then delete the product itself
    DELETE FROM products WHERE id = p_product_id;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Product not found',
            'product_id', p_product_id
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', 'Product deleted successfully',
        'product_id', p_product_id
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION admin_update_product(
    p_session_id TEXT,
    p_id INT,
    p_name TEXT,
    p_description TEXT,
    p_price NUMERIC,
    p_availability BOOLEAN
)
RETURNS JSON AS $$
BEGIN
    UPDATE products
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        price = COALESCE(p_price, price),
        availability = COALESCE(p_availability, availability)
    WHERE id = p_id;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Product not found',
            'product_id', p_id
        );
    END IF;

    RETURN json_build_object(
        'success', true,
        'message', 'Product updated successfully',
        'product_id', p_id
    );
END;
$$ LANGUAGE plpgsql;
