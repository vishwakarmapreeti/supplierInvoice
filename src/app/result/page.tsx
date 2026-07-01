"use client";

export default function ResultPage() {

  return (
      <div className="container">
        <div className="card">
          <h1>Result</h1>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
  );
}
