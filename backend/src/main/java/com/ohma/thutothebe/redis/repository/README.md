# Redis Repositories

This package contains Redis-specific repositories that extend Spring Data Redis repository interfaces.

## Purpose

This package is separated from the main JPA repositories to:
- Avoid Spring Data configuration conflicts
- Clearly separate Redis and JPA data access patterns
- Prevent the warning messages about repository store assignment

## Usage

When creating Redis repositories, place them in this package and ensure they:
- Extend appropriate Redis repository interfaces (e.g., `KeyValueRepository`)
- Work with entities annotated with `@RedisHash`
- Follow Redis-specific data access patterns

## Current Status

Currently, this application uses Redis primarily for:
- Real-time messaging via pub/sub
- Caching (configured separately)
- Session storage (if needed)

No Redis repositories are currently implemented, but this structure is ready for future Redis-based data access needs. 