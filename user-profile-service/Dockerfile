# Step 1: Base image (Node.js)
FROM node:18-alpine

# Step 2: Work directory set cheyadam
WORKDIR /app

# Step 3: Dependencies install cheyadam
COPY package*.json ./
RUN npm install

# Step 4: Code copy cheyadam
COPY . .

# Step 5: TypeScript ni JavaScript ki compile cheyadam
RUN npm run build

# Step 6: Service run cheyadam (Port 8080 or respective port)
EXPOSE 8080
CMD ["node", "dist/index.js"]