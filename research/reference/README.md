# Reference Library System

Version: 1.0.0
Status: Active
Owner: Documentation Engineer

## Purpose
The Reference Library System (RLS) provides derived navigation and lookup documents. It allows humans and AI assistants to quickly locate reusable technical information (like standard IDs, events, Liquid variables) without having to read entire research sessions.

## Source of Truth Hierarchy
1. Official Documentation
2. Research Sessions
3. Knowledge Index
4. Reference Library

**Research Sessions remain the single source of truth.** The Reference Library is purely derived from approved Research Sessions.

## Differences
- **Research Sessions**: The authoritative source where facts, observations, and insights are captured directly from official documentation.
- **Knowledge Index**: The navigational map of all research sessions, showing what topics have been researched.
- **Reference Library**: Summarized, topical cheat sheets (e.g., all known Liquid variables across the platform) compiled from multiple Research Sessions.

## Update Policy
- The Reference Library must never introduce information not present in Research Sessions.
- Every reference entry must cite one or more originating Research Sessions.
- Reference files may consolidate identical knowledge coming from multiple sessions.
- Updates to the Reference Library happen during the "Reference Synchronization" step of the Research Task Completion Protocol, after a research session is completed.
