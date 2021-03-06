import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactDOM from 'react-dom';

const styles = require('./CameraDevice.sass');

class CameraDevice extends Component {
  state = {};

  componentDidMount() {
    // References to all the element we will need.
    const video = ReactDOM.findDOMNode(this).querySelector('#camera-stream'),
      image = ReactDOM.findDOMNode(this).querySelector('#snap'),
      start_camera = ReactDOM.findDOMNode(this).querySelector('#start-camera'),
      controls = ReactDOM.findDOMNode(this).querySelector('.controls'),
      take_photo_btn = ReactDOM.findDOMNode(this).querySelector('#take-photo'),
      delete_photo_btn = ReactDOM.findDOMNode(this).querySelector('#delete-photo'),
      download_photo_btn = ReactDOM.findDOMNode(this).querySelector('#download-photo'),
      error_message = ReactDOM.findDOMNode(this).querySelector('#error-message');

    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


    if (!navigator.getMedia) {
      displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else {

      // Request the camera.
      navigator.getMedia(
        {
          video: true
        },
        // Success Callback
        function (stream) {

          // Create an object URL for the video stream and
          // set it as src of our HTLM video element.
          video.src = window.URL.createObjectURL(stream);

          // Play the video element to start the stream.
          video.play();
          video.onplay = function () {
            showVideo();
          };

        },
        // Error Callback
        function (err) {
          displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
        }
      );

    }


    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function (e) {

      e.preventDefault();

      // Start video playback manually.
      video.play();
      showVideo();

    });


    take_photo_btn.addEventListener("click", function (e) {

      e.preventDefault();

      var snap = takeSnapshot();

      // Show image.
      image.setAttribute('src', snap);
      image.classList.add("visible");

      // Enable delete and save buttons
      delete_photo_btn.classList.remove("disabled");
      download_photo_btn.classList.remove("disabled");

      // Set the href attribute of the download button to the snap url.
      download_photo_btn.href = snap;

      // Pause video playback of stream.
      video.pause();

    });


    delete_photo_btn.addEventListener("click", function (e) {

      e.preventDefault();

      // Hide image.
      image.setAttribute('src', "");
      image.classList.remove("visible");

      // Disable delete and save buttons
      delete_photo_btn.classList.add("disabled");
      download_photo_btn.classList.add("disabled");

      // Resume playback of stream.
      video.play();

    });


    function showVideo() {
      // Display the video stream and the controls.

      hideUI();
      video.classList.add("visible");
      controls.classList.add("visible");
    }


    function takeSnapshot() {
      // Here we're using a trick that involves a hidden canvas element.

      var hidden_canvas = document.querySelector('canvas'),
        context = hidden_canvas.getContext('2d');

      var width = video.videoWidth,
        height = video.videoHeight;

      if (width && height) {

        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;

        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video, 0, 0, width, height);

        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        return hidden_canvas.toDataURL('image/png');
      }
    }


    function displayErrorMessage(error_msg, error) {
      error = error || "";
      if (error) {
        console.log(error);
      }

      error_message.innerText = error_msg;

      hideUI();
      error_message.classList.add("visible");
    }


    function hideUI() {
      // Helper function for clearing the app UI.

      controls.classList.remove("visible");
      start_camera.classList.remove("visible");
      video.classList.remove("visible");
      // snap.classList.remove("visible");
      error_message.classList.remove("visible");
    }

    console.log(video);
  }

  render() {
    return (<div>
      <a href="#" id="start-camera" className={classNames(styles.startCamera, styles.visible)}>Touch
        here to start
        the app.</a>
      <video id="camera-stream" className={styles.cameraStream}>
      </video>
      <img id="snap" className={styles.Snap}/>
      <p id="error-message" className={styles.ErrorMessage}>
      </p>
      <div className={styles.Controls}>
        <a id="delete-photo" href="#" className={classNames(styles.DeletePhoto, styles.disabled)}
           title="Delete Photo">
          <i className={styles.MaterialIcons}>delete</i>
        </a>
        <a id="take-photo" href="#" className={classNames(styles.TakePhoto)} title="Take Photo">
          <i className={styles.MaterialIcons}>camera_alt</i>
        </a>
        <a id="download-photo" href="#" className={classNames(styles.DownloawPhoto, 'disabled')}
           download="selfie.png"
           title="Save Photo">
          <i className={styles.MaterialIcons}>file_download</i></a>
      </div>
      <canvas>
      </canvas>
    </div>);
  }
}

CameraDevice.propTypes = {};
CameraDevice.defaultProps = {};

export default CameraDevice;
