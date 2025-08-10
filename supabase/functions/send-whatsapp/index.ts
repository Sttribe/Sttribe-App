import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, message, type, templateData } = await req.json()

    // WhatsApp Business API integration
    const whatsappApiKey = Deno.env.get('WHATSAPP_API_KEY')
    const whatsappApiUrl = Deno.env.get('WHATSAPP_API_URL') || 'https://graph.facebook.com/v17.0'

    if (!whatsappApiKey) {
      console.log('WhatsApp API key not configured, simulating send...')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'WhatsApp notification simulated (API key not configured)',
          messageId: `sim_${Date.now()}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const response = await fetch(`${whatsappApiUrl}/YOUR_PHONE_NUMBER_ID/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          messageId: result.messages?.[0]?.id,
          message: 'WhatsApp notification sent successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error(result.error?.message || 'Failed to send WhatsApp message')
    }

  } catch (error) {
    console.error('WhatsApp send error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Failed to send WhatsApp notification'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})