<?php

class LaravelModedApp extends Illuminate\Foundation\Application
{
  public function publicPath()
  {
    return realpath($this->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'public');
  }
  public function storagePath()
  {
    return realpath($this->basePath . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'storage');
  }
}
