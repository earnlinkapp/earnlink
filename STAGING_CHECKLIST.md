# EarnLink Staging Integration Checklist

## Infrastructure
- [ ] Hosted PostgreSQL staging database
- [ ] Staging API hosting
- [ ] Staging frontend hosting
- [ ] HTTPS/domain
- [ ] Environment secrets configured through secret manager
- [ ] Private object storage
- [ ] Malware scanning
- [ ] Email/SMS provider

## Backend
- [ ] Mount authentication routes
- [ ] Mount marketplace/application routes
- [ ] Mount contract/messaging routes
- [ ] Mount file submission routes
- [ ] Mount payment routes
- [ ] Mount verification/admin routes
- [ ] Run all seven migrations
- [ ] Replace any remaining in-memory logic
- [ ] Add background webhook/reconciliation worker

## Security
- [ ] Admin MFA enabled
- [ ] Rate limits tested
- [ ] Authorization tests pass
- [ ] Private files cannot be accessed without contract authorization
- [ ] Payment webhooks reject invalid signatures
- [ ] Duplicate webhooks are idempotent
- [ ] Disputed contracts cannot auto-payout
- [ ] Logs do not contain passwords, OTPs, secrets or payment credentials

## Payments
- [ ] Provider merchant/KYC completed
- [ ] Payment sandbox credentials
- [ ] Successful payment test
- [ ] Failed payment test
- [ ] Duplicate webhook test
- [ ] Wrong amount test
- [ ] Wrong currency test
- [ ] Withdrawal success/failure/reversal tests

## Beta
- [ ] 5–20 trusted employers invited
- [ ] 20–50 workers invited
- [ ] Test jobs completed
- [ ] Test contracts funded
- [ ] Test work submitted
- [ ] Test disputes resolved
- [ ] Test withdrawals completed
- [ ] No critical security issues
- [ ] Founder launch sign-off
