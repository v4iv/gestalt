// @flow strict
import React, { PureComponent, type Node } from 'react';
import PropTypes from 'prop-types';
import Box from './Box.js';
import styles from './Image.css';

const shouldScaleImage = (fit) => fit === 'cover' || fit === 'contain';

type Props = {|
  alt: string,
  children?: Node,
  color: string,
  elementTiming?: string,
  fit?: 'contain' | 'cover' | 'none',
  importance?: 'high' | 'low' | 'auto',
  loading?: 'eager' | 'lazy' | 'auto',
  naturalHeight: number,
  naturalWidth: number,
  onError?: () => void,
  onLoad?: () => void,
  sizes?: string,
  src: string,
  srcSet?: string,
|};

export default class Image extends PureComponent<Props> {
  static propTypes = {
    alt: PropTypes.string.isRequired,
    children: PropTypes.node,
    color: PropTypes.string,
    elementTiming: PropTypes.string,
    fit: PropTypes.oneOf(['contain', 'cover', 'none']),
    importance: PropTypes.oneOf(['high', 'low', 'auto']),
    loading: PropTypes.oneOf(['eager', 'lazy', 'auto']),
    naturalHeight: PropTypes.number.isRequired,
    naturalWidth: PropTypes.number.isRequired,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    sizes: PropTypes.string,
    src: PropTypes.string.isRequired,
    srcSet: PropTypes.string,
  };

  static defaultProps: {|
    color: string,
    fit?: 'contain' | 'cover' | 'none',
    importance?: 'high' | 'low' | 'auto',
    loading?: 'eager' | 'lazy' | 'auto',
  |} = {
    color: 'transparent',
    fit: 'none',
    importance: 'auto',
    loading: 'auto',
  };

  componentDidMount() {
    if (shouldScaleImage(this.props.fit)) {
      this.loadImage();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { fit, src } = this.props;
    if (shouldScaleImage(fit) && prevProps.src !== src) {
      this.loadImage();
    }
  }

  handleLoad: () => void = () => {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  handleError: () => void = () => {
    if (this.props.onError) {
      this.props.onError();
    }
  };

  loadImage() {
    if (typeof window !== 'undefined') {
      const image = new window.Image();
      image.onload = this.handleLoad;
      image.onerror = this.handleError;
      image.src = this.props.src;
    }
  }

  render(): Node {
    const {
      alt,
      color,
      children,
      elementTiming,
      fit,
      importance,
      loading,
      naturalHeight,
      naturalWidth,
      sizes,
      src,
      srcSet,
    } = this.props;

    const isScaledImage = shouldScaleImage(fit);
    const childContent = children ? (
      <Box position="absolute" top left bottom right overflow="hidden">
        {children}
      </Box>
    ) : null;

    return isScaledImage ? (
      <div
        aria-label={alt}
        className={fit === 'contain' || fit === 'cover' ? styles[fit] : null}
        style={{
          backgroundColor: color,
          backgroundImage: `url('${src}')`,
        }}
        role="img"
      >
        {childContent}
      </div>
    ) : (
      <Box
        position="relative"
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: color,
            paddingBottom: `${(naturalHeight / naturalWidth) * 100}%`,
          },
        }}
      >
        <img
          alt={alt}
          className={styles.img}
          elementtiming={elementTiming}
          importance={importance}
          loading={loading}
          onError={this.handleError}
          onLoad={this.handleLoad}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
        />
        {childContent}
      </Box>
    );
  }
}
