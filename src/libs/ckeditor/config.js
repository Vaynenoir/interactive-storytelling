/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config0

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: ['Uploadcare', 'find', 'selection', 'spellchecker'] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];
	 // config.extraPlugins = 'dropler';
  
  // // configure the backend service and credentials
  // // aws requires a few extra.. 
  // config.droplerConfig = {
  //     backend: 's3',
  //     settings: {
  //         bucket: 'bucketname',
  //         region: 'your-region',
  //         accessKeyId: 'key',
  //         secretAccessKey: 'secret-key'
  //     }
  // };

	config.imgUploadConfig = {
      settings: {
          bucket: 'bucket-name',
          region: 'region-name',
          accessKeyId: 'access-key',
          secretAccessKey: 'secret-access-key'
      }

};
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';
	config.wsc_height = 600;
	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';
	config.filebrowserWindowHeight = '50%';
	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
config.extraPlugins = 'dialog,dialogui,clipboard,widget,codesnippet';
	config.extraPlugins = 'img-upload';
		config.language = 'en';
		config.language_list = [ 'en:English', 'es:Spanish' ];


};
