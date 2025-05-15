import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing Stripe secret key. Stripe functionality will be limited.');
}

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30' as any, // Using the latest API version available
});

// Create a customer in Stripe
export async function createCustomer(email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error: any) {
    console.error('Error creating Stripe customer:', error.message);
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
}

// Create a subscription for a customer
export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    const invoice = typeof subscription.latest_invoice === 'string' 
      ? null 
      : subscription.latest_invoice;
    
    const paymentIntent = invoice?.payment_intent && 
      typeof invoice.payment_intent !== 'string' 
      ? invoice.payment_intent 
      : null;
    
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  } catch (error: any) {
    console.error('Error creating Stripe subscription:', error.message);
    throw new Error(`Failed to create Stripe subscription: ${error.message}`);
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
    return canceledSubscription;
  } catch (error: any) {
    console.error('Error canceling Stripe subscription:', error.message);
    throw new Error(`Failed to cancel Stripe subscription: ${error.message}`);
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error: any) {
    console.error('Error retrieving Stripe subscription:', error.message);
    throw new Error(`Failed to retrieve Stripe subscription: ${error.message}`);
  }
}

// For development/testing without Stripe integration
export async function mockUpgradeToPro(userId: number) {
  // This function is just for development and should be replaced with actual Stripe integration
  console.log(`Mocking upgrade to Pro for user ${userId}`);
  return {
    success: true,
    message: 'User upgraded to Pro successfully',
  };
}