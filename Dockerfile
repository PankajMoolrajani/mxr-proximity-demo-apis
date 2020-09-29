FROM node
ADD ./ /app
WORKDIR /app
ENV PORT=5000
EXPOSE 5000
RUN npm install
# ENTRYPOINT ["npm", "run", "start"]
# ENTRYPOINT ["/bin/sleep", "216000"]
