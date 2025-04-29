CREATE DATABASE mapAppPostGIS;

\c mapAppPostGIS;

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
