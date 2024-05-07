FROM ubuntu:jammy

RUN apt-get update && \
    apt-get install -y curl tini

# Install OpenJDK
RUN apt-get update && \
    apt-get install -y openjdk-17-jre && \
    apt-get install -y openjdk-17-jdk;

ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/
RUN export JAVA_HOME

# Install C compiler
RUN apt-get update && \
    apt-get install -y gcc && \
    rm -rf /var/lib/lists/*

# Install python
RUN apt-get update && \
    apt-get install -y python3

# Install Nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/local/app

COPY package*.json ./

RUN npm ci && \
    npm cache clean --force && \
    mv /usr/local/app/node_modules /node_modules

COPY . .

ENV PORT 80
EXPOSE 80

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "src/index.js"]