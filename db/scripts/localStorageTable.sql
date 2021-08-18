CREATE TABLE `${t}` (
    method CHAR(3) NOT NULL,
    path VARCHAR(255) NOT NULL,
    token VARCHAR(36) NOT NULL,
    expires BIGINT NOT NULL,
    PRIMARY KEY (method, path)
);