package com.university.config;

import org.springframework.context.annotation.Configuration;

/**
 * Database configuration for MongoDB
 * No schema migration needed for MongoDB (NoSQL document store)
 */
@Configuration
public class DatabaseMigrationConfig {
    // MongoDB handles schema-less document storage automatically
    // No migration or schema alterations needed
}