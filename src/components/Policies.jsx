import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Policies.css";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL;

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/user/privacypolicy`);
        if (res.data?.status === 200 && res.data?.data?.length > 0) {
          const policyDoc = res.data.data[0];
          setPolicies(policyDoc.privacypolicy || []);
          setLastUpdated(policyDoc.updatedAt || "");
        }
      } catch (err) {
        console.error("Error fetching privacy policy:", err);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <section className="pp-root">
      <div className="pp-inner">
        <h1 className="pp-title">Privacy Policy</h1>
        <p className="pp-intro">
          At Dr. Raoof’s Urocare, we are committed to protecting your privacy.
          This policy outlines how we collect, use, and safeguard your personal
          information when you use our website and services.
        </p>

        {policies.length === 0 ? (
          <p className="pp-intro">Loading privacy policy...</p>
        ) : (
          policies.map((section) => (
            <div key={section._id} className="pp-section">
              <h2>{section.section}</h2>
              {section.items.map((item) => (
                <div key={item._id} className="pp-item">
                  {item.title && <h3>{item.title}</h3>}
                  <div className="pp-value">
                    {item.value.split("\n").map((line, idx) => {
                      if (
                        line.trim().startsWith("-") ||
                        line.trim().startsWith("*")
                      ) {
                        return (
                          <li key={idx} className="pp-list-item">
                            {line.replace(/^[-*]\s*/, "")}
                          </li>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {lastUpdated && (
          <p className="pp-updated">
            Last Updated: {new Date(lastUpdated).toDateString()}
          </p>
        )}
      </div>
    </section>
  );
}
