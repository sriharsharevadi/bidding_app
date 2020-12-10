#ubuntu_18_base_docker
FROM ubuntu:18.04
COPY docker-scripts/ubuntu-18-base/base-docker.sh /base-docker.sh
RUN sh base-docker.sh
RUN rm base-docker.sh
ADD  bidding_app/requirements.txt  /opt/
RUN pip install -r /opt/requirements.txt
ADD frontend/package.json /opt/app/frontend/
ADD frontend/package-lock.json /opt/app/frontend/
WORKDIR /opt/app/frontend
RUN npm install

