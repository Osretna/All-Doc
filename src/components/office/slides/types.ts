import { SlideItem } from '../../../types';

export type PowerPointTab =
  | 'file'
  | 'home'
  | 'insert'
  | 'draw'
  | 'design'
  | 'transitions'
  | 'animations'
  | 'slideshow'
  | 'review'
  | 'view'
  | 'shape-format'
  | 'picture-format'
  | 'table-design';

export type PresentationViewMode = 'normal' | 'sorter' | 'notes-page' | 'reading-view' | 'slide-master';

export type TransitionType =
  | 'none'
  | 'morph'
  | 'fade'
  | 'push'
  | 'wipe'
  | 'split'
  | 'reveal'
  | 'random-bars'
  | 'shape'
  | 'uncover'
  | 'cover'
  | 'flash'
  | 'fall-over'
  | 'peel-off'
  | 'page-curl'
  | 'fly-through'
  | 'doors'
  | 'window'
  | 'crush'
  | 'airplane'
  | 'shred'
  | 'zoom';

export type TransitionDirection =
  | 'from-right'
  | 'from-left'
  | 'from-top'
  | 'from-bottom'
  | 'smooth'
  | 'in'
  | 'out'
  | 'horizontal'
  | 'vertical';

export type TransitionSound =
  | 'none'
  | 'applause'
  | 'arrow'
  | 'bell'
  | 'camera'
  | 'cash-register'
  | 'chime'
  | 'click'
  | 'drum-roll'
  | 'laser'
  | 'whoosh';

export interface SlideTransitionConfig {
  type: TransitionType;
  duration: number; // in seconds, default 1.0
  direction: TransitionDirection;
  sound: TransitionSound;
  advanceOnClick: boolean;
  advanceAfterSeconds?: number;
}

export type AnimationCategory = 'entrance' | 'emphasis' | 'exit' | 'motion';

export interface SlideAnimationConfig {
  id: string;
  elementId?: string; // which element this applies to (or whole slide)
  elementName?: string;
  category: AnimationCategory;
  effect: string; // 'appear', 'fade', 'fly-in', 'float-in', 'split', 'wipe', 'zoom', 'bounce', 'pulse', 'teeter', 'spin', 'grow-shrink', 'disappear', 'fly-out'
  start: 'click' | 'with-previous' | 'after-previous';
  duration: number; // in seconds
  delay: number; // in seconds
  direction?: string;
  order: number;
}

export type SlideShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'circle'
  | 'triangle'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'star'
  | 'heart'
  | 'callout'
  | 'cloud'
  | 'line'
  | 'textbox'
  | 'cube'
  | 'cylinder';

export interface SlideShapeElement {
  id: string;
  type: SlideShapeType;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  rotation?: number; // degrees
  fill: string;
  stroke: string;
  strokeWidth: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'right' | 'center' | 'left';
  opacity?: number;
  shadow?: boolean;
  glow?: boolean;
  zIndex: number;
}

export interface SlideSection {
  id: string;
  title: string;
  slideIds: string[];
}

export interface PowerPointSlideData extends SlideItem {
  sectionId?: string;
  hidden?: boolean;
  rehearsedDuration?: number; // seconds
  transitionConfig?: SlideTransitionConfig;
  animations?: SlideAnimationConfig[];
  shapes?: SlideShapeElement[];
  headerText?: string;
  footerText?: string;
  showSlideNumber?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showDate?: boolean;
  dateText?: string;
  inkStrokes?: Array<{
    color: string;
    width: number;
    points: Array<{ x: number; y: number }>;
  }>;
}

export interface SlideSizeConfig {
  preset: '16:9' | '16:10' | '4:3' | 'custom';
  widthCm: number;
  heightCm: number;
  orientation: 'landscape' | 'portrait';
}

export interface SlideMasterLayout {
  id: string;
  name: string;
  nameAr: string;
  isMaster?: boolean;
  backgroundColor: string;
  titleFont: string;
  bodyFont: string;
  accentColor: string;
  hasHeader: boolean;
  hasFooter: boolean;
  hasDate: boolean;
  hasNumber: boolean;
}
