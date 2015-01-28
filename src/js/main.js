(function(P, protocol) {

	"use strict";

	/**
	 * Gravatar implementation
	 * @param  {string}   email MD5 hash or plain text email address
	 * @param  {int}   size  
	 * @param  {Function} cb    
	 * @return {void}         
	 */
	function getGravatarURL(email, size, cb, tryNext )
	{
		var base = 'gravatar.com/avatar/<%=id%>?s=<%=size%>';

		// if email does not contain @ it's already an MD5 hash
		if( email.indexOf('@') > -1 ) 
			email = md5(email);

		var prefix = protocol === 'https:' ? 'https://secure.' : 'http://';
		cb(prefix + parse(base, {id: email, size: size}));
	}

	/**
	 * Facebook implementation
	 * @param  {string|int}   id
	 * @param  {int}   size 
	 * @param  {Function} cb   
	 * @return {void} 
	 */
	function getFacebookURL( id, size, cb, tryNext )
	{
		var base = 'graph.facebook.com/<%=id%>/picture?width=<%=size%>';
		cb( protocol + '//' + parse(base, {id: id, size: size}));
	}

	/**
	 * Google+ implementation
	 * @param  {int}   id   
	 * @param  {int}   size 
	 * @param  {Function} cb   
	 * @return {void}
	 */
	function getGoogleURL( id, size, cb, tryNext )
	{
		var base = 'picasaweb.google.com/data/entry/api/user/<%=id%>?alt=json';
		var url = protocol + '//' + parse(base, {id: id});
		get(url, function(data) {
			var src = data.entry.gphoto$thumbnail.$t.replace('s64', 's' + size); // replace with the correct size
			cb(src);
		}, tryNext);
	}

	/**
	 * Skype implementation
	 * @param  {string}   id   
	 * @param  {int}   size
	 * @param  {Function} cb
	 * @return {void}
	 */
	function getSkypeURL( id, size, cb, tryNext )
	{
		var base = 'api.skype.com/users/<%=id%>/profile/avatar';
		cb(protocol + '//' + parse(base, {id: id}));
	}

	/**
	 * Replace variables in a string
	 * @param  {string} value String that will be parsed
	 * @param  {Object} variables    Key value object
	 * @return {string}
	 */
	function parse( value, variables )
	{
		for(var variable in variables)
		{
			value = value.replace('<%=' + variable + '%>', variables[variable]);
		}
		return value;
	}

	/**
	 * Return a random color
	 * @return {string}
	 */
	function rndColor()
	{
		var colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
		var index = Math.floor(Math.random()*colors.length);
		return colors[ index ];
	}

	/**
	 * Convert a name into initials
	 * @param {string} name
	 * @return {string}
	 */
	function getInitials( name )
	{
		var parts = name.split(' ');
		var initials = '';
		for(var i=0 ; i < parts.length ; i++)
		{
			initials += parts[i].substr(0, 1).toUpperCase();
		}
		return initials;
	}

	/**
	 * Do an ajax request to fetch remote data
	 * @param  {string}   url 
	 * @param  {Function} cb
	 * @return {void}
	 */
	function get(url, successCb, errorCb) {
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) {
					var data = JSON.parse(request.responseText);
					successCb(data);
				} else {
					errorCb(request.status);
				}
			}
		};
		request.open('GET', url, true);
		request.send();
	}

	/**
	 * Create new DOM element <u-avatar>
	 */
	P('u-avatar', { // jshint ignore:line

		triedFacebook: false,
		triedGoogle: false,
		triedSkype: false,
		triedGravatar: false,

		/**
		 * When an attribute is changed update the avatar
		 */
		attributeChanged: function() {
			this.attached();
		},

		/**
		 * Triggerd when a <u-avatar> element is add to the DOM
		 */
		attached: function() {
			this.size = parseInt(this.size, 10) || 60;

			this.imageHidden = false;
			this.contentHidden = true;
			this.fontSize = Math.floor(this.size/3);

			this.fetch();
		},

		fetch: function() {
			var url = null;
			var self = this;
			var tryNext = function() { self.fetch() };

			this.$.avatar.onerror = tryNext;

			if( this.triedFacebook === false && url === null && this.has('facebook-id')) {
				getFacebookURL( this['facebook-id'] , this.size, this.setSrc.bind(this), tryNext );
				this.triedFacebook = true;
				return;
			}

			if( this.triedGoogle === false && url === null && this.has('google-id')) {
				getGoogleURL( this['google-id'] , this.size, this.setSrc.bind(this), tryNext );
				this.triedGoogle = true;
				return;
			}

			if( this.triedSkype === false && url === null && this.has('skype-id')) {
				getSkypeURL( this['skype-id'] , this.size, this.setSrc.bind(this), tryNext );
				this.triedSkype = true;
				return;
			}

			if( this.triedGravatar === false && url === null && this.has('email')) {
				getGravatarURL( this.email, this.size, this.setSrc.bind(this), tryNext );
				this.triedGravatar = true;
				return;
			}

			if( this.has('name') || this.has('value') && (! this.has('email') && ! this.has('skype-id') && ! this.has('google-id') && ! this.has('facebook-id')) ) {
				this.bgcolor = rndColor();
				this.imageHidden = true;
				this.contentHidden = false;
			}

			if( this.has('name') )
				this.value = getInitials( this.name );

			if( url === null && this.has('src')) {
				this.setSrc( parse(this.src, {size: this.size}) );
				return;
			}
		},

		/**
		 * Check if a specific attribute exists on the element
		 * @param  {string}  attr
		 * @return {Boolean}
		 */
		has: function( attr )
		{
			return this[attr] !== null ? true : false;
		},

		/**
		 * Set the src attribute of the image element use to display the avatar
		 * @param {string} src
		 */
		setSrc: function( src )
		{
			if( src === null )
				return;

			this.$.avatar.src = src;
		}
	});


})(Polymer, window.location.protocol);