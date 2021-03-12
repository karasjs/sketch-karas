import convert from './convert';
import link from './link';
import about from './about';
import pack from '../package.json';
import { getThreadDictForKey, setThreadDictForKey, clearPanels } from './tools';
export let TOOLBAR_IDENTIFIER = 'toolbar';
const TOOLBAR_DEFAULT_WIDTH = 40; 

export function onRunToolBar (context) {
  let pluginSketch = context.plugin.url().URLByAppendingPathComponent('Contents').URLByAppendingPathComponent('Resources');
  let document = context.document || context.actionContext.document || MSDocument.currentDocument()

  const stored = getThreadDictForKey(TOOLBAR_IDENTIFIER);

  clearPanels(document, TOOLBAR_IDENTIFIER);
  if (stored) return;

  const makeToolbar = () => {
    const toolbar = NSStackView.stackViewWithViews([]);
    toolbar.setFrame(NSMakeRect(0, 0, 40, 400));
    toolbar.setIdentifier(TOOLBAR_IDENTIFIER);
    toolbar.setSpacing(0);
    toolbar.setFlipped(true);
    toolbar.setBackgroundColor(NSColor.colorWithHex('#FFF'));
    toolbar.orientation = 1;
    return toolbar;
  };

  const addToolbarToView = (toolbar, identifier) => {
    const container = NSView.alloc().initWithFrame(
      NSMakeRect(0, 0, 40, 400),
    );
    container.addSubview(toolbar);
    const viewsDictionary = { container, toolbar };
    const horizontalConstraints = NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views(
      'H:|-0-[toolbar]-0-|',
      0,
      null,
      viewsDictionary,
    );
    const verticalConstraints = NSLayoutConstraint.constraintsWithVisualFormat_options_metrics_views(
      'V:[toolbar]-0-|',
      0,
      null,
      viewsDictionary,
    );
    container.addConstraints(horizontalConstraints);
    container.addConstraints(verticalConstraints);
    (toolbar
      .topAnchor()
      .constraintEqualToAnchor(
        container.safeAreaLayoutGuide().topAnchor(),
      )).setActive(true);
    const viewController = NSViewController.alloc().init();
    viewController.view = container;
    const splitViewItem = NSSplitViewItem.splitViewItemWithViewController(
      viewController,
    );
    splitViewItem.maximumThickness = 40;
    (document.splitViewController()).insertSplitViewItem_atIndex(
      splitViewItem,
      2,
    );
    setThreadDictForKey(identifier, splitViewItem);
  };


  function getImage (name, size) {
    const imageURL = pluginSketch.URLByAppendingPathComponent(name + '.png');
    const image = NSImage.alloc().initWithContentsOfURL(imageURL);
    image.setSize(size);
    image.setScalesWhenResized(true);
    return image;
  }

  function addButton (rect, name, callAction) {
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

  function addImage (rect, name) {
    let view = NSImageView.alloc().initWithFrame(rect);
    let image = getImage(name, rect.size);
    view.setImage(image);
    return view;
  }

  const createImageView = (rect, icon, size ) => {
    const imageView = NSImageView.alloc().initWithFrame(rect);
    const image = getImage(icon, size);
    imageView.setImage(image);
    imageView.setAutoresizingMask(5);
    return imageView;
  };

  function addText (rect, text) {
    let view = NSTextView.alloc().initWithFrame(rect);
    view.editable = false;
    view.selectable = false;
    view.setTextColor(NSColor.colorWithRed_green_blue_alpha(0, 0, 0, 0.2));
    view.setString(text);
    return view;
  }

  const toolbar = makeToolbar();
  
  coscript.setShouldKeepAround(true);



  const iconView = createImageView(NSMakeRect(0, 20, 30, 30), 'icon', NSMakeSize(30, 30));
  toolbar.addView_inGravity(iconView, 1);

  // let textView = addText(NSMakeRect(28, 55, 100, 16), pack.version);
  // contentView.addSubview(textView);

  // const lineView = createImageView(NSMakeRect(8, 52, 162, 1), 'line',NSMakeSize(30, 30));
  // toolbar.addView_inGravity(lineView, 1);

  // let closeBtn = addButton(NSMakeRect(10, 18, 16, 16), 'close', function() {
  //   coscript.setShouldKeepAround(false);
  //   toolbar.close();
  // });
  // contentView.addSubview(closeBtn);


  let convertBtn = addButton(NSMakeRect(0, 0, TOOLBAR_DEFAULT_WIDTH, TOOLBAR_DEFAULT_WIDTH), 'convert', function () {
    convert();
  });
  toolbar.addView_inGravity(convertBtn, 1);

  let linkBtn = addButton(NSMakeRect(0, 0, TOOLBAR_DEFAULT_WIDTH, TOOLBAR_DEFAULT_WIDTH), 'link', function () {
    link();
  });
  toolbar.addView_inGravity(linkBtn, 1);

  let aboutBtn = addButton(NSMakeRect(0, 0, TOOLBAR_DEFAULT_WIDTH, TOOLBAR_DEFAULT_WIDTH), 'about', function () {
    about();
  });
  toolbar.addView_inGravity(aboutBtn, 1);

  addToolbarToView(toolbar, TOOLBAR_IDENTIFIER);
}
