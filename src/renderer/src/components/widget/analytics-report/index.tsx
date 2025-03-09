import { Badge } from "@renderer/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { useDeviceSettings } from "@renderer/hooks/state/use-device-settings";

const modeEnum = {
  0: "None",
  1: "CW",
  2: "Pulses",
  3: "R.Pulses",
};

const signalEnum = {
  0: "Default",
  1: "DELDOP",
  2: "FNOISE",
  3: "MULTON/SINGLE",
  4: "BARAGE",
};

const getActiveSignals = (decimalValue: number | undefined): string => {
  if (decimalValue === undefined) return "No data";

  const binaryString = decimalValue.toString(2).padStart(5, "0");
  const reversedBinaryString = binaryString.split("").reverse().join("");

  const activeSignals: number[] = [];

  for (let i = 0; i < reversedBinaryString.length; i++) {
    if (reversedBinaryString[i] === "1") {
      activeSignals.push(i + 1);
    }
  }

  return activeSignals.length > 0 ? activeSignals.join(", ") : "None";
};

type PageType = "single" | "multi" | "sweep" | "barrage" | "filtered" | "doppler" | "default";

interface AnalyticsReportProps {
  pageType: PageType;
}

const AnalyticsReport = ({ pageType }: AnalyticsReportProps): JSX.Element => {
  const { history } = useDeviceSettings(); // دریافت مقدار ذخیره‌شده
  const savedData = history[1]; // مقدار تأیید‌شده برای نمایش استفاده شود

  let pageSpecificContent;
  switch (pageType) {
    case "single":
      pageSpecificContent = (
        <>
          <p>
            <strong>Single Tone - Extra Info:</strong>
            <span className="font-small text-black">Frequency:</span>
            <Badge variant="secondary">{savedData.SINGLE?.FREQCY0}</Badge>
            <span className="font-small text-black">Attenuation:</span>
            <Badge variant="secondary">{savedData.SINGLE?.ATTENV0}</Badge>
          </p>
        </>
      );
      break;

    case "multi":
      pageSpecificContent = (
        <>
          <p>
            <strong>Multi-Tone - Extra Info:</strong>
            <div><span className="font-small text-black">Signals select:</span>
      <Badge variant="secondary">
        {getActiveSignals(savedData.MULTON?.MSELECT)}
      </Badge>
    </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                <span className="font-small text-black">Frequency {i + 1}:</span>
                <Badge variant="secondary">{savedData.MULTON?.[`FREQCY${i}`]}</Badge>
                <span className="font-small text-black">Attenuation:</span>
                <Badge variant="secondary">{savedData.MULTON?.[`ATTENV${i}`]}</Badge>
                {/* <span className="font-small text-black">signals select:</span>
                <Badge variant="secondary">{savedData.MULTON.MSELECT}</Badge> */}
              </span>
            ))}
            
          </p>
        </>
      );
      break;

    case "sweep":
      pageSpecificContent = (
        <>
          <p>
            <strong>Sweep - Extra Info:</strong>
            <span className="font-small text-black">Min frequency:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.MINFREQ}</Badge>
            <span className="font-small text-black">Max frequency:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.MAXFREQ}</Badge>
            <span className="font-small text-black">Step:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.STPFREQ}</Badge>
            <span className="font-small text-black">Level:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.ATTENVL}</Badge>
            <span className="font-small text-black">Reverse:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.REVERSE}</Badge>
            <span className="font-small text-black">Time:</span>
            <Badge variant="secondary">{savedData.SWEEPF?.SWPTIME}</Badge>
          </p>
        </>
      );
      break;

    case "barrage":
      pageSpecificContent = (
        <>
          <p>
            <strong>barrage - Extra Info:</strong>
            <span className="font-small text-black">Number of carries:</span>
            <Badge variant="secondary">{savedData.BARAGE?.BNUMBER}</Badge>
          </p>
        </>
      );
      break;

    case "filtered":
      pageSpecificContent = (
        <>
          <p>
            <strong>Filtered Noise - Extra Info:</strong>
            <span className="font-small text-black">Bandwidth:</span>
            <Badge variant="secondary">{savedData.FNOISE?.NOISEBW}</Badge>
            <span className="font-small text-black">Center Frequency:</span>
            <Badge variant="secondary">{savedData.FNOISE?.SHFFREQ}</Badge>
            <span className="font-small text-black">Enable shift:</span>
            <Badge variant="secondary">{savedData.FNOISE?.SHFENBL}</Badge>
          </p>
        </>
      );
      break;

    case "doppler":
      pageSpecificContent = (
        <>
          <p>
            <strong>Delay Doppler - Extra Info:</strong>
            <span className="font-small text-black">Enable delay:</span>
            <Badge variant="secondary">{savedData.DELDOP?.DELAYEN}</Badge>
            <span className="font-small text-black">Enable doppler shift:</span>
            <Badge variant="secondary">{savedData.DELDOP?.DOPLREN}</Badge>
            <span className="font-small text-black">Delay:</span>
            <Badge variant="secondary">{savedData.DELDOP?.DLYVALU}</Badge>
            <span className="font-small text-black">Doppler:</span>
            <Badge variant="secondary">{savedData.DELDOP?.DOPFREQ}</Badge>
          </p>
        </>
      );
      break;

    default:
      pageSpecificContent = <p>No specific data for this page.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Report</CardTitle>
        {/* <CardDescription>Analytics connected device</CardDescription> */}
      </CardHeader>
      <CardContent>
        {/* بخش ثابت برای همه صفحات */}
        <p>
          <strong>Signal:</strong>
          <Badge variant="secondary">{signalEnum[savedData.NOISES?.NOISESS]}</Badge>
        </p>

        <p>
          <strong>Frequency Value:</strong>
          <Badge variant="secondary">{savedData.LOFATT?.LOFRQCY}</Badge>
        </p>
        <p>
          <strong>Mode:</strong>
          <Badge variant="secondary">{modeEnum[savedData.NOISES?.PSGMODE]}</Badge>
          <div>
            <span className="font-small text-black">pulse(on time):</span>
            <Badge variant="secondary">{savedData.NOISES?.ONDETER}</Badge>
            <span className="font-small text-black">pulse(off time):</span>
            <Badge variant="secondary">{savedData.NOISES?.OFFDETR}</Badge>
            <span className="font-small text-black">R.pulse(on time)</span>
            <Badge variant="secondary">{savedData.NOISES?.ONSTOCH}</Badge>
            <span className="font-small text-black">R.pulse(off time)</span>
            <Badge variant="secondary">{savedData.NOISES?.OFFSTOC}</Badge>
          </div>
        </p>

        {/*بخش مخصوص هر صفحه */}
        {pageSpecificContent}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AnalyticsReport;
