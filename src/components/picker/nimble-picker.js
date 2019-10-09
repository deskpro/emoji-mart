import '../../vendor/raf-polyfill'

import React from 'react'
import PropTypes from 'prop-types'

import * as icons from '../../svgs'
import store from '../../utils/store'
import frequently from '../../utils/frequently'
import { deepMerge, measureScrollbar, getSanitizedData } from '../../utils'
import { PickerPropTypes } from '../../utils/shared-props'

import Tabs from '../tabs/Tabs'
import TabLink from '../tabs/TabLink'
import Category from '../category'
import Preview from '../preview'
import Search from '../search'
import { PickerDefaultProps } from '../../utils/shared-default-props'
import CustomDropzone from '../dropzone/dropzone'

const I18N = {
  search: 'Search',
  clear: 'Clear', // Accessible label on "clear" button
  notfound: 'No Icon Found',
  colorText: 'Choose your default color',
  custom: 'Custom',
  icons: 'Icons',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    custom: 'Custom',
  },
}

export default class NimblePicker extends React.PureComponent {
  constructor(props) {
    super(props)

    this.RECENT_CATEGORY = { id: 'recent', label: 'Recent', icons: null }
    this.CUSTOM_CATEGORY = { id: 'custom', label: 'Custom', icons: [] }
    this.SEARCH_CATEGORY = {
      id: 'search',
      label: 'Search',
      icons: null,
    }

    this.data = props.data
    this.i18n = deepMerge(I18N, props.i18n)
    // this.icons = deepMerge(icons, props.icons)
    this.state = {
      color: props.color || store.get('color') || props.defaultColor,
      firstRender: true,
      activeTab: 'icons',
    }

    this.categories = []
    let allCategories = [].concat(Object.values(this.data.categories))

    this.hideRecent = true

    if (props.include != undefined) {
      allCategories.sort((a, b) => {
        if (props.include.indexOf(a.id) > props.include.indexOf(b.id)) {
          return 1
        }

        return -1
      })
    }

    for (
      let categoryIndex = 0;
      categoryIndex < allCategories.length;
      categoryIndex++
    ) {
      const category = allCategories[categoryIndex]
      let isIncluded =
        props.include && props.include.length
          ? props.include.indexOf(category.id) > -1
          : true
      let isExcluded =
        props.exclude && props.exclude.length
          ? props.exclude.indexOf(category.id) > -1
          : false
      if (!isIncluded || isExcluded) {
        continue
      }

      if (props.iconsToShowFilter) {
        let newEmojis = []

        const { icons } = category
        for (let emojiIndex = 0; emojiIndex < icons.length; emojiIndex++) {
          const emoji = icons[emojiIndex]
          if (props.iconsToShowFilter(this.data.emojis[emoji] || emoji)) {
            newEmojis.push(emoji)
          }
        }

        if (newEmojis.length) {
          let newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id,
          }

          this.categories.push(newCategory)
        }
      } else {
        this.categories.push(category)
      }
    }

    let includeRecent =
      props.include && props.include.length
        ? props.include.indexOf(this.RECENT_CATEGORY.id) > -1
        : true
    let excludeRecent =
      props.exclude && props.exclude.length
        ? props.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
        : false
    if (includeRecent && !excludeRecent) {
      this.hideRecent = false
      this.categories.unshift(this.RECENT_CATEGORY)
    }

    if (this.categories[0]) {
      this.categories[0].first = true
    }

    this.categories.unshift(this.SEARCH_CATEGORY)

    this.setSearchRef = this.setSearchRef.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.setScrollRef = this.setScrollRef.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollPaint = this.handleScrollPaint.bind(this)
    this.handleEmojiOver = this.handleEmojiOver.bind(this)
    this.handleEmojiLeave = this.handleEmojiLeave.bind(this)
    this.handleIconClick = this.handleIconClick.bind(this)
    this.handleIconSelect = this.handleIconSelect.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.setPreviewRef = this.setPreviewRef.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.color) {
      this.setState({ color: props.color })
    } else if (props.defaultColor && !store.get('color')) {
      this.setState({ color: props.defaultColor })
    }
  }

  componentDidMount() {
    if (this.state.firstRender) {
      this.testStickyPosition()
      this.firstRenderTimeout = setTimeout(() => {
        this.setState({ firstRender: false })
      }, 60)
    }
  }

  componentDidUpdate() {
    this.updateCategoriesSize()
    this.handleScroll()
  }

  componentWillUnmount() {
    this.SEARCH_CATEGORY.icons = null

    clearTimeout(this.leaveTimeout)
    clearTimeout(this.firstRenderTimeout)
  }

  testStickyPosition() {
    const stickyTestElement = document.createElement('div')

    const prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-']

    prefixes.forEach(
      (prefix) => (stickyTestElement.style.position = `${prefix}sticky`),
    )

    this.hasStickyPosition = !!stickyTestElement.style.position.length
  }

  handleEmojiOver(icon) {
    var { preview } = this
    if (!preview) {
      return
    }

    // Use Array.prototype.find() when it is more widely supported.
    // const emojiData = this.CUSTOM_CATEGORY.emojis.filter(
    //   (customEmoji) => customEmoji.id === icon.id,
    // )[0]
    // for (let key in emojiData) {
    //   if (emojiData.hasOwnProperty(key)) {
    //     icon[key] = emojiData[key]
    //   }
    // }

    preview.setState({ icon })
    clearTimeout(this.leaveTimeout)
  }

  handleEmojiLeave(emoji) {
    var { preview } = this
    if (!preview) {
      return
    }

    this.leaveTimeout = setTimeout(() => {
      preview.setState({ emoji: null })
    }, 16)
  }

  handleIconClick(icon, style, e) {
    this.props.onClick(icon, style, e)
    this.handleIconSelect(icon, style)
  }

  handleIconSelect(icon, style) {
    const { color } = this.state
    this.props.onSelect(icon, style, color)
    if (!this.hideRecent && !this.props.recent) frequently.add(icon)

    var component = this.categoryRefs['category-1']
    if (component) {
      let maxMargin = component.maxMargin
      component.forceUpdate()

      window.requestAnimationFrame(() => {
        if (!this.scroll) return
        component.memoizeSize()
        if (maxMargin == component.maxMargin) return

        this.updateCategoriesSize()
        this.handleScrollPaint()

        if (this.SEARCH_CATEGORY.icons) {
          component.updateDisplay('none')
        }
      })
    }
  }

  handleScroll() {
    if (!this.waitingForPaint) {
      this.waitingForPaint = true
      window.requestAnimationFrame(this.handleScrollPaint)
    }
  }

  handleScrollPaint() {
    this.waitingForPaint = false

    if (!this.scroll) {
      return
    }

    let activeCategory = null

    if (this.SEARCH_CATEGORY.icons) {
      activeCategory = this.SEARCH_CATEGORY
    } else {
      var target = this.scroll,
        scrollTop = target.scrollTop,
        scrollingDown = scrollTop > (this.scrollTop || 0),
        minTop = 0

      for (let i = 0, l = this.categories.length; i < l; i++) {
        let ii = scrollingDown ? this.categories.length - 1 - i : i,
          category = this.categories[ii],
          component = this.categoryRefs[`category-${ii}`]

        if (component) {
          let active = component.handleScroll(scrollTop)

          if (!minTop || component.top < minTop) {
            if (component.top > 0) {
              minTop = component.top
            }
          }

          if (active && !activeCategory) {
            activeCategory = category
          }
        }
      }

      if (scrollTop < minTop) {
        activeCategory = this.categories.filter(
          (category) => !(category.anchor === false),
        )[0]
      } else if (scrollTop + this.clientHeight >= this.scrollHeight) {
        activeCategory = this.categories[this.categories.length - 1]
      }
    }

    this.scrollTop = scrollTop
  }

  handleSearch(icons) {
    this.SEARCH_CATEGORY.icons = icons

    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`]

      if (component && component.props.name != 'Search') {
        let display = icons ? 'none' : 'inherit'
        component.updateDisplay(display)
      }
    }

    this.forceUpdate()
    if (this.scroll) {
      this.scroll.scrollTop = 0
    }
    this.handleScroll()
  }

  handleColorChange(color) {
    var newState = { color: color },
      { onColorChange } = this.props

    this.setState(newState)
    store.update(newState)

    onColorChange(color)
  }

  handleTabChange(activeTab) {
    this.setState({
      activeTab,
    })
  }

  handleKeyDown(e) {
    let handled = false

    switch (e.keyCode) {
      case 13:
        let icon

        if (
          this.SEARCH_CATEGORY.icons &&
          this.SEARCH_CATEGORY.icons.length &&
          (icon = getSanitizedData(
            this.SEARCH_CATEGORY.icons[0],
            this.state.color,
            this.props.set,
            this.props.data,
          ))
        ) {
          this.handleIconSelect(icon)
        }

        handled = true
        break
    }

    if (handled) {
      e.preventDefault()
    }
  }

  updateCategoriesSize() {
    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`]
      if (component) component.memoizeSize()
    }

    if (this.scroll) {
      let target = this.scroll
      this.scrollHeight = target.scrollHeight
      this.clientHeight = target.clientHeight
    }
  }

  getCategories() {
    return this.state.firstRender
      ? this.categories.slice(0, 3)
      : this.categories
  }

  setTabsRef(c) {
    this.tabs = c
  }

  setSearchRef(c) {
    this.search = c
  }

  setPreviewRef(c) {
    this.preview = c
  }

  setScrollRef(c) {
    this.scroll = c
  }

  setCategoryRef(name, c) {
    if (!this.categoryRefs) {
      this.categoryRefs = {}
    }

    this.categoryRefs[name] = c
  }

  render() {
    var {
        perLine,
        emojiSize,
        set,
        sheetSize,
        sheetColumns,
        sheetRows,
        style,
        title,
        icon,
        iconColor,
        color,
        custom,
        native,
        backgroundImageFn,
        iconsToShowFilter,
        showPreview,
        showColorPicker,
        showDropZone,
        showCustom,
        emojiTooltip,
        include,
        exclude,
        recent,
        autoFocus,
        skinEmoji,
        notFound,
        notFoundEmoji,
        onAcceptedFiles,
      } = this.props,
      { color, activeTab } = this.state,
      width = perLine * (emojiSize + 12) + 12 + 2 + measureScrollbar()

    return (
      <section
        style={{ width: width, ...style }}
        className="emoji-mart"
        aria-label={title}
        onKeyDown={this.handleKeyDown}
      >
        <div className="emoji-mart-bar">
          {showCustom && (
            <Tabs active={activeTab} onChange={this.handleTabChange}>
              <TabLink name="icons">{this.i18n.icons}</TabLink>
              <TabLink name="custom">{this.i18n.custom}</TabLink>
            </Tabs>
          )}
        </div>

        <Search
          ref={this.setSearchRef}
          onSearch={this.handleSearch}
          data={this.data}
          i18n={this.i18n}
          iconsToShowFilter={iconsToShowFilter}
          include={include}
          exclude={exclude}
          custom={this.CUSTOM_CATEGORY.emojis}
          autoFocus={autoFocus}
        />

        <div
          className="icons"
          style={{ display: activeTab === 'icons' ? 'block' : 'none' }}
        >
          <div
            ref={this.setScrollRef}
            className="emoji-mart-scroll"
            onScroll={this.handleScroll}
          >
            {this.getCategories().map((category, i) => {
              return (
                <Category
                  ref={this.setCategoryRef.bind(this, `category-${i}`)}
                  key={i}
                  id={category.id}
                  name={category.label}
                  icons={category.icons}
                  perLine={perLine}
                  native={native}
                  hasStickyPosition={this.hasStickyPosition}
                  data={this.data}
                  i18n={this.i18n}
                  recent={
                    category.id == this.RECENT_CATEGORY.id ? recent : undefined
                  }
                  custom={
                    category.id == this.RECENT_CATEGORY.id
                      ? this.CUSTOM_CATEGORY.icons
                      : undefined
                  }
                  iconProps={{
                    native: native,
                    color: color,
                    size: emojiSize,
                    set: set,
                    sheetSize: sheetSize,
                    sheetColumns: sheetColumns,
                    sheetRows: sheetRows,
                    forceSize: native,
                    tooltip: emojiTooltip,
                    backgroundImageFn: backgroundImageFn,
                    onOver: this.handleEmojiOver,
                    onLeave: this.handleEmojiLeave,
                    onClick: this.handleIconClick,
                  }}
                  notFound={notFound}
                  notFoundEmoji={notFoundEmoji}
                />
              )
            })}
          </div>

          {(showPreview || showColorPicker) && (
            <div className="emoji-mart-bar">
              <Preview
                ref={this.setPreviewRef}
                data={this.data}
                title={title}
                icon={icon}
                showColorPicker={showColorPicker}
                showPreview={showPreview}
                iconProps={{
                  native: native,
                  size: 38,
                  color: color,
                  set: set,
                  sheetSize: sheetSize,
                  sheetColumns: sheetColumns,
                  sheetRows: sheetRows,
                  backgroundImageFn: backgroundImageFn,
                }}
                colorsProps={{
                  color: color,
                  onChange: this.handleColorChange,
                  skinEmoji: skinEmoji,
                }}
                i18n={this.i18n}
              />
            </div>
          )}
        </div>

        {showCustom && (
          <div
            className="custom"
            style={{ display: activeTab === 'custom' ? 'block' : 'none' }}
          >
            <Category
              ref={this.setCategoryRef.bind(this, `category-custom`)}
              id="custom"
              name="Custom"
              icons={custom}
              custom={custom}
              perLine={perLine}
              native={native}
              hasStickyPosition={this.hasStickyPosition}
              data={this.data}
              i18n={this.i18n}
              iconProps={{
                native: native,
                color: color,
                size: emojiSize,
                set: set,
                sheetSize: sheetSize,
                sheetColumns: sheetColumns,
                sheetRows: sheetRows,
                forceSize: native,
                tooltip: emojiTooltip,
                backgroundImageFn: backgroundImageFn,
                onOver: this.handleEmojiOver,
                onLeave: this.handleEmojiLeave,
                onClick: this.handleIconClick,
              }}
              notFound={notFound}
              notFoundEmoji={notFoundEmoji}
            />
            {showDropZone && (
              <CustomDropzone
                i18n={this.i18n}
                onAcceptedFiles={onAcceptedFiles}
              />
            )}
          </div>
        )}
      </section>
    )
  }
}

NimblePicker.propTypes /* remove-proptypes */ = {
  ...PickerPropTypes,
  data: PropTypes.object.isRequired,
  icons: PropTypes.object,
  categories: PropTypes.object,
}
NimblePicker.defaultProps = { ...PickerDefaultProps }
