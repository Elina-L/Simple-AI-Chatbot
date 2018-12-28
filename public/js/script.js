const socket = io();

const SpeechRecognition = window.SpeechRecognition || 
						  window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

var outputYou = document.querySelector('.output-you');
var outputBot = document.querySelector('.output-bot');

recognition.lang = 'en-US';
recognition.interimResults = false;

document.querySelector('button').addEventListener('click', () => {
	console.log('Ready to listen.');
	recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', function (event) {
	let last = event.results.length - 1;
	let text = event.results[last][0].transcript;
	console.log(event.results);
	outputYou.innerHTML = event.results[0][0].transcript;
	socket.emit('chat message', text);

});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
	const synth = window.speechSynthesis;
	const utterance = new SpeechSynthesisUtterance();
	utterance.text = text;
	synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
	outputBot.innerHTML = replyText;
	synthVoice(replyText);
});