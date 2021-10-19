FROM node:alpine
EXPOSE 3000
COPY . /app
WORKDIR /app
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
ENV POLYGONSCAN_API_KEY=""
ENV POLYGON_WALLET="0xC8dDE2d01f7A1B34C460Ac8C4A69d8b633Dc820A"
ENV POLYGON_CONTRACT_ADDRESS="0x0b220b82f3ea3b7f6d9a1d8ab58930c064a2b5bf"
ENV BUCKET_TRANSACTION_DETAILS="testhtml"
ENV BUCKET_TRANSACTION_BACKUPS="transactionbackups"
ENV BUCKET_ACTIVE_ORDERS="activeorders"
ENV BUCKET_PUBLIC_RESOURCES="figurga"
ENV BUCKET_PRODUCT_KEYS="cdkeys"
RUN npm install express --save
RUN npm install request --save
RUN npm install aws-sdk --save
RUN npm install cors --save
CMD [ "node", "main.js", "env"]