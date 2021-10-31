package com.weex.app.extend;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.text.TextUtils;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.taobao.weex.WXEnvironment;
import com.taobao.weex.WXSDKManager;
import com.taobao.weex.adapter.IWXImgLoaderAdapter;
import com.taobao.weex.common.WXImageStrategy;
import com.taobao.weex.dom.WXImageQuality;

public class CommentSDKWeexImageAdapter implements IWXImgLoaderAdapter{
    public CommentSDKWeexImageAdapter() {}

    @Override
    public void setImage(final String url, final ImageView view,
                         WXImageQuality quality, final WXImageStrategy strategy) {

        WXSDKManager.getInstance().postOnUiThread(new Runnable() {

            @Override
            public void run() {
                if (view == null || view.getLayoutParams() == null) {
                    return;
                }
                if (TextUtils.isEmpty(url)) {
                    view.setImageBitmap(null);
                    return;
                }
                if (url.startsWith("file://")) {
                    Glide.with(WXEnvironment.getApplication()).load(url).into(view);
                    return;
                }
                String temp = url;
                if (url.startsWith("//")) {
                    temp = "http:" + url;
                }
                Glide.with(WXEnvironment.getApplication()).load(temp).asBitmap().into(new WeeXImageTarget(strategy, url, view));
            }
        }, 0);
    }

    private class WeeXImageTarget extends SimpleTarget<Bitmap> {

        private WXImageStrategy mWXImageStrategy;
        private String mUrl;
        private ImageView mImageView;

        WeeXImageTarget(WXImageStrategy strategy, String url, ImageView imageView) {
            mWXImageStrategy = strategy;
            mUrl = url;
            mImageView = imageView;
        }

        @Override
        public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
            mImageView.setImageBitmap(resource);
        }

        @Override
        public void onLoadFailed(Exception e, Drawable errorDrawable) {
        }
    }

}
