
-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADMIN TABLE
CREATE TABLE admin (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VENDORS TYPE TABLE 'FarmHouse'|'Venue'|'Catering'|'Photography'
CREATE TABLE category (
    id UUID PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL
);

-- VENDORS TABLE
CREATE TABLE vendors (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    vendor_type_id UUID REFERENCES category(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VENUE TABLE
CREATE TABLE venues (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    max_person_limit INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FARMHOUSE TABLE
CREATE TABLE farmhouses (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    per_night_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATERING PACKAGES TABLE
CREATE TABLE catering_packages (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATERING CUSTOM ORDERS TABLE
CREATE TABLE catering_custom_orders (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_details TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PHOTOGRAPHY PACKAGES TABLE
CREATE TABLE photography_packages (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PHOTOGRAPHY CUSTOM ORDERS TABLE
CREATE TABLE photography_custom_orders (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_details TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    service_type VARCHAR(50) CHECK (service_type IN ('FarmHouse', 'Venue', 'Catering', 'Photography')),
    service_id UUID NOT NULL,  -- ID of the booked service (can be venue_id, farmhouse_id, etc.)
    status VARCHAR(20) CHECK (status IN ('Pending', 'Completed', 'Canceled')) DEFAULT 'Pending',
    payment_status VARCHAR(20) CHECK (payment_status IN ('Partially Paid', 'Fully Paid', 'Canceled')) DEFAULT 'Partially Paid',
    visit_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POS TRANSACTIONS TABLE
CREATE TABLE pos_transactions (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('Payment', 'Refund')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS & RATINGS TABLE
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    service_type VARCHAR(50) CHECK (service_type IN ('FarmHouse', 'Venue', 'CateringPackage', 'PhotographyPackage')),
    service_id UUID NOT NULL,  -- Can be venue_id, farmhouse_id, catering_package_id, photography_package_id
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating between 1 and 5
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS TABLE
CREATE TABLE reports (
    id UUID PRIMARY KEY,
    admin_id UUID REFERENCES admin(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    report_details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHAT SYSTEM TABLE WITH MESSAGE STATUSES
CREATE TABLE chats (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE, -- Chats linked to bookings
    sender_id UUID NOT NULL, -- Can be user_id or vendor_id
    receiver_id UUID NOT NULL, -- Can be user_id or vendor_id
    message TEXT NOT NULL,
    parent_message_id UUID, -- Threaded replies (NULL if it's a main message)
    status VARCHAR(20) CHECK (status IN ('Sent', 'Delivered', 'Read', 'Deleted')) DEFAULT 'Sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_message_id) REFERENCES chats(id) ON DELETE CASCADE
);

-- Blog Table
CREATE TABLE blogs (
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL,  -- Can be a vendor or admin
    author_role VARCHAR(10) CHECK (author_role IN ('Vendor', 'Admin')), -- Role of author
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Comments Table
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Likes Table
CREATE TABLE blog_likes (
    id UUID PRIMARY KEY,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ads Table
CREATE TABLE ads (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE, -- Vendor requesting the ad
    ad_type VARCHAR(20) CHECK (ad_type IN ('Featured', 'Sponsored')) NOT NULL, -- Ad category
    entity_type VARCHAR(20) CHECK (entity_type IN ('Farmhouse', 'Venue', 'Photography Package', 'Catering Package')) NOT NULL, -- What the ad is for
    entity_id UUID NOT NULL, -- ID of the farmhouse, venue, or package being advertised
    price DECIMAL(10,2) NOT NULL, -- Ad price
    status VARCHAR(20) CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Active', 'Expired')) DEFAULT 'Pending', -- Approval status
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the ad goes live
    end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the ad expires
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External Ads
CREATE TABLE external_ads (
    id UUID PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL, -- Ad image (stored via Cloudinary or another CDN)
    redirect_url VARCHAR(500) NOT NULL, -- External website URL
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Expired')) DEFAULT 'Active', -- Ad status
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the ad goes live
    end_date TIMESTAMP, -- Expiration date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Payments Table
CREATE TABLE ad_payments (
    id UUID PRIMARY KEY,
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')) DEFAULT 'Pending',
    transaction_id VARCHAR(255) UNIQUE,
    paid_at TIMESTAMP
);