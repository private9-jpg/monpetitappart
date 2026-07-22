-- AddOptInToNewsletterSubscriber
-- Double opt-in token and unsubscribe token

ALTER TABLE "NewsletterSubscriber" ADD COLUMN "optInToken" TEXT;
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "optInExpiresAt" TIMESTAMP;
ALTER TABLE "NewsletterSubscriber" ADD COLUMN "unsubscribeToken" TEXT;

CREATE UNIQUE INDEX "NewsletterSubscriber_optInToken_key" ON "NewsletterSubscriber"("optInToken");
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");
