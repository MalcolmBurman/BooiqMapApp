CREATE DATABASE mapAppPostGIS;

\c mapAppPostGIS;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(256) UNIQUE NOT NULL,
  firstName VARCHAR(256),
  lastName VARCHAR(256),
  passwordHash VARCHAR(256) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id), 
  mapobject JSONB NOT NULL,
  fastighetsagare VARCHAR(256),
  beteckning VARCHAR(256),
  area VARCHAR(256),
  byggar VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  adress VARCHAR(256),
  mapobject JSONB NOT NULL
);
