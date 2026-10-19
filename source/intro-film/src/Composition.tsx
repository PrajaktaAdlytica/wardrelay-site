import React from 'react';
import {AbsoluteFill, Composition, Img, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const smooth = Easing.bezier(.4, 0, .2, 1);
type ShotProps = {src: string; frames: number; startScale: number; endScale: number; origin: string; drift: number; light?: boolean};

// Frame-driven camera choreography. No CSS animation or wall-clock randomness.
const Shot: React.FC<ShotProps> = ({src, frames, startScale, endScale, origin, drift, light = true}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const p = interpolate(frame, [0, frames - 1], [0, 1], clamp);
  const camera = interpolate(p, [0, 1], [startScale, endScale], {easing: smooth});
  const x = interpolate(p, [0, 1], [-drift, drift]);
  return <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#d4c9ad'}}>
    <AbsoluteFill style={{transform: `translateX(${x * width}px) scale(${camera})`, transformOrigin: origin}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
    {light && <AbsoluteFill style={{pointerEvents: 'none', opacity: .10, mixBlendMode: 'soft-light', background: `linear-gradient(${112 + p * 6}deg, transparent ${12 + p * 12}%, #fff5cf ${31 + p * 14}%, transparent ${59 + p * 10}%)`}} />}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 44%, transparent 48%, rgba(27,34,24,.10) 100%)', opacity: light ? 1 : 0}} />
  </AbsoluteFill>;
};

export const WardWalkFilm: React.FC = () => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="The connected campus" durationInFrames={150} premountFor={fps}>
        <Shot src="campus.png" frames={150} startScale={1.04} endScale={1.23} origin="52% 44%" drift={-.012}/>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 30, easing: smooth})}/>
      <TransitionSeries.Sequence name="A human handoff" durationInFrames={150} premountFor={fps}>
        <Shot src="review.png" frames={150} startScale={1.12} endScale={1.25} origin="54% 53%" drift={.009}/>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 30, easing: smooth})}/>
      <TransitionSeries.Sequence name="Through the threshold" durationInFrames={120} premountFor={fps}>
        <Shot src="threshold.png" frames={120} startScale={1.02} endScale={1.30} origin="65% 47%" drift={0}/>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 36, easing: smooth})}/>
      <TransitionSeries.Sequence name="Arrive at Ward Walk" durationInFrames={126} premountFor={fps}>
        <Shot src="arrival.webp" frames={126} startScale={1.05} endScale={1.025} origin="50% 50%" drift={0} light={false}/>
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>;
};
export const MyComposition: React.FC = () => <>
  <Composition id="WardWalkIntro" component={WardWalkFilm} width={1920} height={1080} fps={30} durationInFrames={450}/>
  <Composition id="WardWalkPortrait" component={WardWalkFilm} width={720} height={1280} fps={30} durationInFrames={450}/>
</>;
