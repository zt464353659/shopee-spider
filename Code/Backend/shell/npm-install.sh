#! /bin/bash

if [ ! -f /vue-msf/data/www/shopee-advt-spider/Code/Middleend/.npm-installed ]; then
	cd /vue-msf/data/www/shopee-advt-spider/Code/Middleend/  \
	&& yarn cache clean  \
	&& yarn install \
	&& touch /vue-msf/data/www/shopee-advt-spider/Code/Middleend/.npm-installed
fi

