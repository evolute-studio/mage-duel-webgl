import { init, track } from '@amplitude/analytics-node';

// Ініціалізуємо Amplitude один раз
init(process.env.AMPLITUDE_API_KEY!);

export async function GET(
  request: Request,
  context: { params: Promise<{ source: string; campaign: string }> }
) {
  const { source, campaign } = await context.params;
  const userAgent = request.headers.get('user-agent') || '';

  // Детект платформи
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = isIOS || isAndroid;

  // Відправляємо івент в Amplitude
  try {
    await track(
      'install_link_click',
      {
        source,
        campaign,
        platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop',
        user_agent: userAgent,
        is_mobile: isMobile,
        timestamp: Date.now()
      },
      {
        user_id: `anonymous_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }
    );
  } catch (error) {
    console.error('Amplitude tracking failed:', error);
    // Продовжуємо роботу навіть якщо tracking failed
  }

  // Редирект на відповідний store
  let redirectUrl: string;

  if (isIOS) {
    redirectUrl = 'https://apps.apple.com/us/app/mage-duel/id6745639584';
  } else if (isAndroid) {
    redirectUrl = 'https://play.google.com/store/apps/details?id=com.evolute.mageduel';
  } else {
    // Desktop - редирект на головну сторінку
    redirectUrl = 'https://mageduel.evolute.network';
  }

  return Response.redirect(redirectUrl, 307);
}
