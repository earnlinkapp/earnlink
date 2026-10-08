# Staging Database Tests

After provisioning PostgreSQL:

1. Run migrations 001–007 in order.
2. Confirm all migration versions are recorded.
3. Insert test worker/employer/admin users.
4. Create a test job.
5. Create an application.
6. Create a contract.
7. Insert a test payment intent.
8. Insert a duplicate webhook event and confirm the unique constraint prevents duplication.
9. Insert ledger entries and verify balance calculation.
10. Create a withdrawal.
11. Create a dispute and verify the contract remains blocked from automatic settlement.
12. Create private submission-file metadata.
13. Confirm foreign keys and check constraints reject invalid data.
14. Test transaction rollback.
