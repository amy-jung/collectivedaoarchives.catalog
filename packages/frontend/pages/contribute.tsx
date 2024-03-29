import { useState } from "react";
import type { NextPage } from "next";
import { Toast, toast } from "react-hot-toast";
import { hashMessage } from "viem";
import { useAccount, useSignTypedData } from "wagmi";

type ResultUrl = {
  url: string;
  success: boolean;
  error?: string;
};

const EIP_712_DOMAIN = {
  name: "Collective DAO Catalog",
  version: "1",
  chainId: 10,
} as const;

const EIP_712_TYPES = {
  Message: [{ name: "urlHash", type: "string" }],
} as const;

const Contribute: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();

  const onSubmitUrl = async () => {
    try {
      setIsSubmitting(true);

      let signature;
      try {
        signature = await signTypedDataAsync({
          domain: EIP_712_DOMAIN,
          types: EIP_712_TYPES,
          primaryType: "Message",
          message: { urlHash: hashMessage(JSON.stringify([url])) },
        });
      } catch (e) {
        console.error("Error signing message", e);
        toast.error("Error signing message");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: [url], signature, address }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result[0].success) {
          toast.success("Link submitted!");
          setUrl("");
        } else {
          toast.error(result.result[0].error);
        }
      } else {
        const result = await response.json();
        toast.error(result.error);
      }
    } catch (e) {
      console.log("Error submitting link", e);
      toast.error("Error submitting link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitUrls = async () => {
    try {
      setIsSubmitting(true);
      const parsedUrls = urls.split("\n").filter(url => url !== "" && url !== " " && url !== "\n" && url !== "\r\n");

      let signature;
      try {
        signature = await signTypedDataAsync({
          domain: EIP_712_DOMAIN,
          types: EIP_712_TYPES,
          primaryType: "Message",
          message: { urlHash: hashMessage(JSON.stringify(parsedUrls)) },
        });
      } catch (e) {
        console.error("Error signing message", e);
        toast.error("Error signing message");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: parsedUrls,
          signature,
          address,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const resultData: ResultUrl[] = result.result;
        const allSuccess = resultData.every(item => item.success);
        if (allSuccess) {
          toast.success("Links submitted!");
          setUrls("");
        } else {
          toast.error(t => resultFormatted(t, resultData), { duration: 60000 });
        }
      } else {
        const result = await response.json();
        toast.error(result.error);
      }
    } catch (e) {
      console.log("Error submitting links", e);
      toast.error("Error submitting links");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultFormatted = (t: Toast, result: ResultUrl[]) => {
    return (
      <div>
        <p className="text-green-700">Links submitted!</p>
        <p className="text-orange-600 mt-2 mb-2">There were errors on some links:</p>
        <ul className="list-disc list-inside">
          {result.map(item => (
            <li key={item.url} className={`mb-1 ${item.success ? "text-green-700" : "text-red-600"}`}>
              <span className="font-bold">URL:</span> {item.url}
              {!item.success && (
                <span>
                  {" "}
                  - <span className="font-bold">Error:</span> {item.error}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button className="btn" onClick={() => toast.dismiss(t.id)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <div className="container mx-auto w-[1150px] max-w-[90%] mt-14">
        <h1 className="font-bold text-xl md:text-4xl">HELP ARCHIVE DAO EVENTS</h1>
        <h2 className="text-xl mt-2">Submit a link to a DAO event</h2>
        <div className="flex flex-col mt-12">
          <h3 className="flex font-bold">Submit a URL page</h3>
          <div className="flex flex-col md:flex-row w-full mt-2 gap-2">
            <input
              type="text"
              value={url}
              onChange={value => setUrl(value.target.value)}
              className="grow p-2 px-6 border-2 border-primary outline-0"
              placeholder="http://"
            />
            {address ? (
              <button className="btn btn-primary rounded-none w-[100px] self-end" onClick={onSubmitUrl}>
                {!isSubmitting ? "SUBMIT" : <span className="loading loading-spinner"></span>}
              </button>
            ) : (
              <button className="btn btn-primary rounded-none w-[200px] self-end" disabled>
                Connect wallet
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-12">
          <h3 className="flex font-bold">Submit multiple URLs</h3>
          <div className="flex flex-col w-full mt-2 items-end">
            <textarea
              value={urls}
              onChange={value => setUrls(value.target.value)}
              className="grow p-2 px-6 border-2 border-primary flex w-[100%] outline-0"
              placeholder="http://"
              rows={8}
            />
            {address ? (
              <button className="btn btn-primary rounded-none w-[100px] flex mt-2" onClick={onSubmitUrls}>
                {!isSubmitting ? "SUBMIT" : <span className="loading loading-spinner"></span>}
              </button>
            ) : (
              <button className="btn btn-primary rounded-none w-[200px] flex mt-2" disabled>
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
