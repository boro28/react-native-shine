import { Image } from 'react-native';

const singularity_shift_source = require('../assets/singularity_shift.png');
export const singularity_shift_img = Image.resolveAssetSource(
  singularity_shift_source
).uri;

const singularity_shift_2_source = require('../assets/singularity_shift_2.png');
export const singularity_shift_2_img = Image.resolveAssetSource(
  singularity_shift_2_source
).uri;

const card_source = require('../assets/card.png');
export const card_img = Image.resolveAssetSource(card_source).uri;

const skybreaker_rider_source = require('../assets/dragon_slop.png');
export const skybreaker_rider_img = Image.resolveAssetSource(
  skybreaker_rider_source
).uri;

const tree_source = require('../assets/tree.png');
export const tree_img = Image.resolveAssetSource(tree_source).uri;

const watch_source = require('../assets/watch.png');
export const watch_img = Image.resolveAssetSource(watch_source).uri;

export const woj_image = Image.resolveAssetSource(
  require('../assets/woj.png')
).uri;

export const void_image = Image.resolveAssetSource(
  require('../assets/void.png')
).uri;

export const boro_image = Image.resolveAssetSource(
  require('../assets/boro.png')
).uri;

export const cat_image = Image.resolveAssetSource(
  require('../assets/cat-card.png')
).uri;

export const blured_dragon_image = Image.resolveAssetSource(
  require('../assets/blured_dragon_slop.png')
).uri;

export const tree_edge = Image.resolveAssetSource(
  require('../assets/tree_edge.png')
).uri;

export const IMAGES = [
  singularity_shift_2_img,
  singularity_shift_img,
  card_img,
  skybreaker_rider_img,
  tree_img,
  watch_img,
  woj_image,
  void_image,
  boro_image,
  cat_image,
];
