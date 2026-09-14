AI STUDIO DEPLOY READY

1) ეს ZIP ატვირთე ახალ AI Studio Build პროექტში მთლიანად.
2) Preview-ისთვის ბრძანება: npm run dev
3) Production build: npm run build
4) Cloud Run start: npm start
5) ჯანმრთელობის შემოწმება: /healthz

მნიშვნელოვანი ცვლილება:
- პირველი/მეორე გაკვეთილი აღარ იტვირთება srcDoc-ით. ისინი public/directions.html-დან იტვირთება, ამიტომ Preview და Publish ერთსა და იმავე HTML/CSS/JS-ს იყენებს.
- public/assets-ში ჩასმულია ყველა მაღალი ხარისხის PNG, ამიტომ deploy-ზე სურათები არ იკარგება.
- package.json-ში არის start script, რომელიც უსმენს Cloud Run-ის PORT-ს.
