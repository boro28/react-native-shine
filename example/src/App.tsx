import { TabView, type Route } from 'react-native-tab-view';
import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';
import {
  addV2d,
  angleToV2d,
  ColorPresets,
  multiplyV2d,
  Shine,
  useOrientation,
  type V2d,
  zeroV2d,
} from 'react-native-shine';
import { IMAGES, tree_edge, tree_img } from './img';
import type {
  ColorMask,
  DeepPartiallyOptional,
  ReverseHoloDetectionChannelFlags,
  GlareOptions,
} from '../../src/types/types';
import DataInput from './components/data-input';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, {
  BrightnessSlider,
  HueSlider,
  Panel4,
  PreviewText,
  SaturationSlider,
} from 'reanimated-color-picker';

const DEFAULT_GLARE_OPTIONS: GlareOptions = {
  // max is 64
  glowPower: 1,
  // in radian, it makes sens to clamp it to Pi, half a turn
  hueShiftAngleMax: 0,
  // in radian, it makes sens to clamp it to -Pi, half a turn
  hueShiftAngleMin: 0,
  hueBlendPower: 0.2,
  // max 100
  lightIntensity: 1,
  glareIntensity: 0.2,
} as const;

const DEFAULT_DETECTION_CHANNEL_OPTIONS: Partial<ReverseHoloDetectionChannelFlags> =
  {
    redChannel: 0,
    greenChannel: 0,
    blueChannel: 0,
    hue: 0,
    saturation: 0,
    value: 0,
  };
const routes = [
  { key: 'glare', title: 'Glare' },
  { key: 'detection', title: 'Detection Channels' },
  { key: 'mask', title: 'Color Mask' },
  { key: 'image', title: 'Image' },
];
function extractRGB(value: string): [number, number, number] {
  return value.match(/\d+/g)?.map(Number) as [number, number, number];
}
const modyfier = 2;
const shift = 0.5;

export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const orientation = useOrientation();
  const touchPosition = useSharedValue<V2d>(zeroV2d);
  const rotation = useRef<number>(0);
  const nh = 0.4;
  const nw = nh;

  const [image, setImage] = useState(IMAGES[0]);
  const [glareOptions, setGlareOptions] = useState(DEFAULT_GLARE_OPTIONS);
  const [rgbTolerance, setRgbTolerance] = useState({ tolerance: 1 });
  const [colorMaskOptions, setColorMaskOptions] = useState<
    DeepPartiallyOptional<ColorMask, 'baseColor'>
  >({
    baseColor: ColorPresets.BLUE, //[80, 60, 30],
    useHSV: true,
    hueToleranceRange: { upper: 9, lower: 9 },
    lowBrightnessThreshold: 0.1,
    lowSaturationThreshold: 0.00000000001,
  });
  //bigger values make the channels less reflective
  //smaller values make the channels more reflective
  const [detectionChannelState, setDetectionChannelState] = useState(
    DEFAULT_DETECTION_CHANNEL_OPTIONS
  );

  useFrameCallback(() => {
    touchPosition.value = addV2d(
      zeroV2d,
      multiplyV2d(angleToV2d((rotation.current += 0.1)), 0.5)
    );
  });

  // const onDetectionChannelColorPickHsv = (colorsMap: ColorFormatsObject) => {
  //   const numbers = extractRGB(colorsMap.hsv);

  //   setDetectionChannelState((oldData) => ({
  //     ...oldData,
  //     hue: numbers[0],
  //     saturation: numbers[1],
  //     value: numbers[2],
  //   }));
  // };
  const onDetectionChannelColorPick = (colorsMap: ColorFormatsObject) => {
    let numbers = extractRGB(colorsMap.rgb);
    numbers = numbers.map((num) => (num / 255 - shift) * modyfier * -1) as [
      number,
      number,
      number,
    ];

    setDetectionChannelState((oldData) => ({
      ...oldData,
      redChannel: numbers[0],
      greenChannel: numbers[1],
      blueChannel: numbers[2],
    }));
  };
  const onMaskColorPick = (colorsMap: ColorFormatsObject) => {
    const color = extractRGB(colorsMap.rgb);
    setColorMaskOptions((oldData) => ({
      ...oldData,
      baseColor: color,
    }));
  };

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'glare':
        return (
          <ScrollView>
            {(
              Object.keys(DEFAULT_GLARE_OPTIONS) as Array<keyof GlareOptions>
            ).map((key) => (
              <DataInput
                key={key}
                data={glareOptions}
                name={key}
                setData={setGlareOptions}
              />
            ))}
          </ScrollView>
        );
      case 'detection':
        return (
          <ScrollView>
            <ColorPicker
              sliderThickness={25}
              thumbSize={24}
              thumbShape="circle"
              onCompleteJS={onDetectionChannelColorPick}
              thumbAnimationDuration={100}
              style={styles.picker}
              adaptSpectrum
              boundedThumb
            >
              <Panel4 style={styles.panelStyle} thumbShape="ring" />{' '}
              <View>
                <Text style={styles.sliderTitle}>Hue</Text>
                <HueSlider style={styles.sliderStyle} />
              </View>
              <View>
                <Text style={styles.sliderTitle}>Saturation</Text>
                <SaturationSlider style={styles.sliderStyle} reverse />
              </View>
              <View>
                <Text style={styles.sliderTitle}>Brightness</Text>
                <BrightnessSlider style={styles.sliderStyle} />
              </View>
              <PreviewText colorFormat="rgba" />
            </ColorPicker>
            {(
              Object.keys(DEFAULT_DETECTION_CHANNEL_OPTIONS) as Array<
                keyof typeof DEFAULT_DETECTION_CHANNEL_OPTIONS
              >
            ).map((key) => (
              <DataInput
                key={key}
                data={detectionChannelState}
                name={key}
                setData={setDetectionChannelState}
              />
            ))}
          </ScrollView>
        );
      case 'mask':
        return (
          <ScrollView>
            <ColorPicker
              sliderThickness={25}
              thumbSize={30}
              thumbShape="circle"
              onCompleteJS={onMaskColorPick}
              thumbAnimationDuration={100}
              style={styles.picker}
              adaptSpectrum
              boundedThumb
              value={`rgb(${colorMaskOptions.baseColor.join(',')})`}
            >
              <Panel4 style={styles.panelStyle} thumbShape="ring" />{' '}
              <View>
                <Text style={styles.sliderTitle}>Hue</Text>
                <HueSlider style={styles.sliderStyle} />
              </View>
              <View>
                <Text style={styles.sliderTitle}>Saturation</Text>
                <SaturationSlider style={styles.sliderStyle} reverse />
              </View>
              <View>
                <Text style={styles.sliderTitle}>Brightness</Text>
                <BrightnessSlider style={styles.sliderStyle} />
              </View>
              <PreviewText colorFormat="rgba" />
            </ColorPicker>
            <DataInput
              data={rgbTolerance}
              name={'tolerance'}
              setData={setRgbTolerance}
            />
          </ScrollView>
        );
      case 'image':
        return (
          <View>
            {/* <Button title="Add Image" onPress={handleAddImage} /> */}
            <ScrollView contentContainerStyle={styles.gallery}>
              {IMAGES.map((imageUri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setImage(imageUri)}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={[
                      styles.image,
                      image === imageUri && styles.imageSelected,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <View
        style={[
          orientation === 'PORTRAIT'
            ? styles.containerCol
            : styles.containerRow,
          styles.containerColor,
          { backgroundColor: '#0a2e3bff' },
        ]}
      >
        <Shine
          width={734 * nw}
          height={1024 * nh}
          imageURI={tree_img}
          maskURI={tree_edge}
          addHolo={true}
          addReverseHolo={true}
          reverseHoloDetectionChannelOptions={detectionChannelState}
          glareOptions={glareOptions}
          touchPosition={touchPosition}
          translateViewIn3d
          // colorMaskOptions={{
          //   ...colorMaskOptions,
          // }}
          //// colorMaskOptions={
          //   {
          // baseColor: [80, 80, 80],
          // rgbToleranceRange: { lower: [30, 30, 30], upper: [40, 40, 40] },
          // }
          // }
        />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ backgroundColor: '#197292ff', paddingBottom: 50 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerCol: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerColor: {
    // backgroundColor: '#ae78aeff',
    // backgroundColor: '#2c2c2c',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  picker: {
    gap: 20,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderTitle: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 4,
    fontFamily: 'Quicksand',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  image: {
    width: 80,
    height: 100,
    margin: 5,
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: 'black',
  },
  imageSelected: {
    borderColor: 'red',
  },
});
