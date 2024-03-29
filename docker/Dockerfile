# === Build Stage ===
FROM ubuntu:latest as builder

# Install any needed packages
RUN apt-get update && \
  apt-get install --no-install-recommends -y build-essential curl git gnupg ca-certificates

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install --no-install-recommends -y nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN npm install yarn -g

ARG CACHEBUST=1
RUN echo "CACHEBUST=${CACHEBUST}"

WORKDIR /snap
RUN git clone https://github.com/PolkaGate/snap.git .

# Build the project
RUN yarn && yarn build

# === Runtime Stage ===
FROM node:20-alpine

# Set environment variable
ENV NODE_ENV=production

WORKDIR /snap

# Copy the built files from the builder stage
COPY --from=builder /snap/ ./

EXPOSE 8000
EXPOSE 8080

# Command to run the application
CMD ["yarn", "start"]