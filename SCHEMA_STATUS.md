# Database Schema Status

The seven migration layers are now represented by a coherent relational schema.

Core entities:
users → jobs → applications → contracts → work submissions → wallet/payment/reviews

Trust/security entities:
disputes, reviews, notifications, audit logs, verification requests, security events, admin MFA

Financial entities:
payment intents, webhook events, reconciliation records, wallet ledger, withdrawals

File entity:
private submission files with malware-scan status.

## Important
The SQL still needs to be executed against a real staging PostgreSQL instance.
Passing SQL generation is not the same as passing database migration testing.
