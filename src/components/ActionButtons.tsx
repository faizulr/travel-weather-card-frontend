import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import type { Forecast } from '@/types/weather';
import { formatDateRange, formatDateForFilename, getFullDayName } from '@/lib/formatDate';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  forecast: Forecast;
  cardRef: React.RefObject<HTMLDivElement>;
}

export function ActionButtons({ forecast, cardRef }: ActionButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1350,
        style: {
          transform: 'scale(2.7)',
          transformOrigin: 'top left',
        },
        pixelRatio: 1,
      });

      const link = document.createElement('a');
      const citySlug = forecast.location.name.toLowerCase().replace(/\s+/g, '-');
      const startDate = formatDateForFilename(forecast.daily[0].date);
      link.download = `weather-${citySlug}-${startDate}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'Downloaded!',
        description: 'Weather card saved as PNG.',
      });
    } catch (err) {
      toast({
        title: 'Download failed',
        description: 'Could not generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    const { location, daily, bestDayIndex } = forecast;
    const startDate = daily[0].date;
    const endDate = daily[daily.length - 1].date;
    const bestDay = daily[bestDayIndex];

    const dailySummary = daily
      .map(d => `${d.dayLabel} ${d.tempHigh}/${d.tempLow} ${d.precipProbability}%`)
      .join(' • ');

    const summary = `${location.name}, ${location.country} — ${formatDateRange(startDate, endDate)}

Best day: ${getFullDayName(bestDay.dayLabel)}

${dailySummary}

via travelweather.app`;

    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Summary copied to clipboard.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        size="lg"
        className="gap-2"
        aria-label="Download weather card as PNG image"
      >
        <Download className="h-5 w-5" />
        {isDownloading ? 'Generating...' : 'Download PNG'}
      </Button>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="lg"
        className="gap-2"
        aria-label="Copy weather summary to clipboard"
      >
        {isCopied ? (
          <>
            <Check className="h-5 w-5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-5 w-5" />
            Copy Summary
          </>
        )}
      </Button>
    </div>
  );
}
