const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// WhatsApp notification API
export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, message, type, templateData } = await request.json()

    // WhatsApp Business API integration
    const whatsappApiKey = process.env.WHATSAPP_API_KEY
    const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0'
    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!whatsappApiKey) {
      console.log('WhatsApp API key not configured, simulating send...')
      return Response.json(
        {
          success: true,
          message: 'WhatsApp notification simulated (API key not configured)',
          messageId: `sim_${Date.now()}`
        },
        { headers: corsHeaders }
      )
    }

    // Format phone number (remove + and ensure country code)
    const formattedPhone = phone.replace(/\D/g, '').replace(/^91/, '91')

    // Prepare WhatsApp message payload
    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message
      }
    }

    // Send WhatsApp message
    const phoneNumberId = whatsappPhoneNumberId || 'YOUR_PHONE_NUMBER_ID'
    const response = await fetch(`${whatsappApiUrl}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (response.ok) {
      return Response.json(
        {
          success: true,
          messageId: result.messages?.[0]?.id,
          message: 'WhatsApp notification sent successfully'
        },
        { headers: corsHeaders }
      )
    } else {
      throw new Error(result.error?.message || 'Failed to send WhatsApp message')
    }
  } catch (error: any) {
    console.error('WhatsApp send error:', error)
    return Response.json(
      {
        success: false,
        error: error?.message || 'Failed to send WhatsApp notification',
        message: 'Failed to send WhatsApp notification'
      },
      { status: 400, headers: corsHeaders }
    )
  }
}

// Get notification templates
export async function GET(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const templates = {
      group_invite: {
        template: "🎬 You've been invited to join '{groupName}' on OTT Share! Split costs and enjoy {platform} together. Join now: {inviteLink}",
        variables: ['groupName', 'platform', 'inviteLink']
      },
      payment_reminder: {
        template: "💳 Payment reminder for '{groupName}'. Your share: ₹{amount}. Due date: {dueDate}. Pay now: {paymentLink}",
        variables: ['groupName', 'amount', 'dueDate', 'paymentLink']
      },
      payment_success: {
        template: "✅ Payment successful! ₹{amount} paid for '{groupName}'. Transaction ID: {transactionId}",
        variables: ['amount', 'groupName', 'transactionId']
      },
      group_created: {
        template: "🎉 Group '{groupName}' created successfully! Share this code with friends: {groupCode}",
        variables: ['groupName', 'groupCode']
      },
      subscription_purchased: {
        template: "🎬 {platform} subscription activated for '{groupName}'! Login details will be shared separately. Enjoy streaming!",
        variables: ['platform', 'groupName']
      }
    }

    return Response.json(
      {
        success: true,
        data: templates,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Get templates error:', error)
    return Response.json(
      { success: false, error: error?.message || 'Failed to fetch templates' },
      { status: 500, headers: corsHeaders }
    )
  }
}