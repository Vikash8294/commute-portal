// import { useState, useEffect } from "react";

// export const useGoogleMapsLoader = (apiKey) => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     if (window.google) {
//       setIsLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       setIsLoaded(true);
//     };

//     script.onerror = () => {
//       console.error("Failed to load Google Maps API script.");
//       setIsLoaded(false);
//     };

//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [apiKey]);

//   return isLoaded;
// };
