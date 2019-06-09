export default function() {
	this.addFilter('ColorOverlayFilter', function(folder) {
		folder.addColor(this, 'color');
	});
}