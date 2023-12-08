import { useState } from "react";
import type { NextPage } from "next";
import { toast, Toast } from "react-hot-toast";

type ResultUrl = {
  url: string;
  success: boolean;
  error?: string;
};

const Contribute: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [urls, setUrls] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitUrl = async () => {
    try {
      setIsSubmitting(true);

      // TODO: add signature
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: [url] }),
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

      // TODO: add signature
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: urls.split("\n").filter(url => url !== "" && url !== " " && url !== "\n" && url !== "\r\n") }),
      });

      if (response.ok) {
        const result = await response.json();
        const resultData: ResultUrl[] = result.result;
        const allSuccess = resultData.every(item => item.success);
        if (allSuccess) {
          toast.success("Links submitted!");
          setUrls("");
        } else {
          toast.error((t) => resultFormatted(t, resultData), { duration: 60000 });
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
            <li className={`mb-1 ${item.success ? "text-green-700" : "text-red-600"}`}>
              <span className="font-bold">URL:</span> {item.url}
              {!item.success && <span> - <span className="font-bold">Error:</span> {item.error}</span>}
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button className="btn" onClick={() => toast.dismiss(t.id)}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-8 md:px-24">
      <div className="container mx-auto w-[1150px] max-w-[90%] mt-14">
        <h1 className="font-bold text-xl md:text-4xl">HELP ARCHIVE DAO EVENTS</h1>
        <h2 className="text-xl mt-2">Submit a link to a DAO event</h2>
        <div className="flex flex-col mt-12">
          <h3 className="flex font-bold">Submit a URL page</h3>
          <div className="flex flex-row w-full mt-2">
            <input
              type="text"
              value={url}
              onChange={value => setUrl(value.target.value)}
              className="grow p-2 px-6 border-2 border-primary"
              placeholder="http://"
            />
            <button className="btn btn-primary rounded-none w-[100px]" onClick={onSubmitUrl}>
              {!isSubmitting ? "SUBMIT" : <span className="loading loading-spinner"></span>}
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-12">
          <h3 className="flex font-bold">Submit multiple URLs</h3>
          <div className="flex flex-col w-full mt-2 items-end">
            <textarea
              value={urls}
              onChange={value => setUrls(value.target.value)}
              className="grow p-2 px-6 border-2 border-primary flex w-[100%]"
              placeholder="http://"
              rows={8}
            />
            <button className="btn btn-primary rounded-none w-[100px] flex mt-2" onClick={onSubmitUrls}>
              {!isSubmitting ? "SUBMIT" : <span className="loading loading-spinner"></span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
