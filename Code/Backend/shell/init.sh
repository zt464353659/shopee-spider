#! /bin/bash

# BASE_DIR ##/vue-msf/data/www
# PROJECT  ##项目名称
# PROJECT_DIR ##项目目录
# VERSION ##当前版本
# ARCHIVE ##附件地址
# PLATFORM ##平台
# MSF_ENV  ##环境变量

DATE=`date +%Y%m%d%H%M%S`

##copy supervisor config

cp ${PROJECT_DIR}/Code/Backend/shell/supervisor/conf/*.conf  /vue-msf/supervisor/conf.d/ && \
chown super.super -R /vue-msf/supervisor/conf.d/
#yarn 安装扩展

# touch /vue-msf/data/supervisor/log/shopee-api.log
# chown super.super /vue-msf/data/supervisor/log/shopee-api.log

# cd /vue-msf/data/www/shopee-api/Code/Middleend/ && yarn install
echo "source ${PROJECT_DIR}/Code/Backend/shell/npm-install.sh" >> /vue-msf/bin/init.sh

#安装 chrome 相关扩展
yum install pango.x86_64 \
			libXcomposite.x86_64 \
			libXcursor.x86_64 \
			libXdamage.x86_64 \
			libXext.x86_64 \
			libXi.x86_64 \
			libXtst.x86_64 \
			cups-libs.x86_64 \
			libXScrnSaver.x86_64 \
			libXrandr.x86_64 \
			GConf2.x86_64 \
			alsa-lib.x86_64 \
			atk.x86_64 gtk3.x86_64 -y

yum install ipa-gothic-fonts \
			xorg-x11-fonts-100dpi \
			xorg-x11-fonts-75dpi \
			xorg-x11-utils \
			xorg-x11-fonts-cyrillic \
			xorg-x11-fonts-Type1 \
			xorg-x11-fonts-misc -y