import convert from './convert';

export function onRunToolBar(context) {
  let pluginSketch = context.plugin.url().URLByAppendingPathComponent('Contents').URLByAppendingPathComponent('Resources');

  function getImage(name, size) {
    let imageURL = pluginSketch.URLByAppendingPathComponent(name + '.png');
    let image = NSImage.alloc().initWithContentsOfURL(imageURL);
    image.setSize(size);
    return image;
  }

  function addButton(rect, name, callAction) {
    let button = NSButton.alloc().initWithFrame(rect);
    let image = getImage(name, rect.size);
    button.setImage(image);
    button.setBordered(false);
    button.sizeToFit();
    button.setButtonType(NSMomentaryChangeButton);
    button.setCOSJSTargetFunction(callAction);
    button.setAction('callAction:');
    return button;
  }

  function addImage(rect, name) {
    let view = NSImageView.alloc().initWithFrame(rect);
    let image = getImage(name, rect.size);
    view.setImage(image);
    return view;
  }
  let toolbar = NSPanel.alloc().init();
  coscript.setShouldKeepAround(true);
  // toolbar.setStyleMask(NSTitledWindowMask + NSClosableWindowMask);
  toolbar.setStyleMask(NSTitledWindowMask + NSFullSizeContentViewWindowMask);
  toolbar.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(1, 1, 1, 1));
  toolbar.setTitleVisibility(NSWindowTitleHidden);
  toolbar.setTitlebarAppearsTransparent(true);
  toolbar.setFrame_display(NSMakeRect(100, 200, 120, 78), false);
  toolbar.becomeKeyWindow();
  toolbar.setLevel(NSFloatingWindowLevel);

  let contentView = toolbar.contentView();

  let iconView = addImage(NSMakeRect(10, 57, 16, 16), 'icon');
  contentView.addSubview(iconView);

  let lineView = addImage(NSMakeRect(8, 52, 104, 1), 'line');
  contentView.addSubview(lineView);

  let closeBtn = addButton(NSMakeRect(10, 18, 16, 16), 'close', function() {
    coscript.setShouldKeepAround(false);
    toolbar.close();
  });
  contentView.addSubview(closeBtn);

  let convertBtn = addButton(NSMakeRect(36, 10, 32, 32), 'convert', function() {
    convert();
  });
  contentView.addSubview(convertBtn);

  let link = addButton(NSMakeRect(78, 10, 32, 32), 'link', function() {
    console.log(22)
  });
  contentView.addSubview(link);

  toolbar.makeKeyAndOrderFront(nil);
}
