(function ($) {

  $(document).on('click', '.chip .close', function () {

    const $this = $(this);

    if ($this.closest('.chips').data('initialized')) {
      return;
    }

    $this.closest('.chip').remove();
  });

  class MaterialChip {

    constructor(chips, options) {

      this.chips = chips;
      this.$document = $(document);
      this.options = options;
      this.eventsHandled = false;
      this.ulWrapper = $('<ul class="chip-ul z-depth-1" tabindex="0"></ul>');
      this.defaultOptions = {
        data: [],
        dataChip: [],
        placeholder: '',
        secondaryPlaceholder: ''
      };

      this.selectors = {
        chips: '.chips',
        chip: '.chip',
        input: 'input',
        delete: '.fas',
        selectedChip: '.selected'
      };

      this.keyCodes = {
        enter: 13,
        backspace: 8,
        delete: 46,
        arrowLeft: 37,
        arrowRight: 39,
        comma: 188
      };

      this.init();
    }


    init() {

      this.optionsDataStatement();
      this.assignOptions();

      this.chips.each((index, element) => {

        const $this = $(element);
        if ($this.data('initialized')) {
          return;
        }

        const options = $this.data('options');
        if (!options.data || !Array.isArray(options.data)) {
          options.data = [];
        }

        $this.data('chips', options.data);
        $this.data('index', index);
        $this.data('initialized', true);
        $this.attr('tabindex', 0);

        if (!$this.hasClass(this.selectors.chips)) {
          $this.addClass('chips');
        }
        this.renderChips($this);
      });

      if (!this.eventsHandled) {

        this.handleEvents();
        this.eventsHandled = true;
      }
      return this;
    }

    optionsDataStatement() {

      if (this.options === 'data') {
        return this.chips.data('chips');
      }

      if (this.options === 'options') {
        return this.chips.data('options');
      }

      return true;
    }

    assignOptions() {

      this.chips.data('options', $.extend({}, this.defaultOptions, this.options));
    }

    handleEvents() {

      this.handleSelecorChips();
      this.handleBlurInput();
      this.handleSelectorChip();
      this.handleDocumentKeyDown();
      this.handleDocumentFocusIn();
      this.handleDocumentFocusOut();
      this.handleDocumentKeyDownChipsInput();
      this.handleDocumentClickChipsDelete();
      this.inputKeyDown();
      this.renderedLiClick();
      this.dynamicInputChanges();
    }

    handleSelecorChips() {

      this.$document.on('click', this.selectors.chips, e => $(e.target).find(this.selectors.input).focus().addClass('active'));
    }

    handleBlurInput() {

      this.$document.on('blur', this.selectors.chips, e => {

        setTimeout(() => this.ulWrapper.removeClass('active').hide(), 100);
        $(e.target).removeClass('active');
        $('.chip.selected').removeClass('selected');
      });
    }

    handleSelectorChip() {

      this.chips.on('click', '.chip', function () {

        $('.chip.selected').not(this).removeClass('selected');
        $(this).toggleClass('selected');
      });
    }

    handleDocumentKeyDown() {

      this.chips.on('keydown', e => {

        const $selectedChip = this.$document.find(this.selectors.chip + this.selectors.selectedChip);
        const $chipsWrapper = $selectedChip.closest(this.selectors.chips);
        const siblingsLength = $selectedChip.siblings(this.selectors.chip).length;

        if (!$selectedChip.length) {
          return;
        }

        const backspacePressed = e.which === this.keyCodes.backspace;
        const deletePressed = e.which === this.keyCodes.delete;
        const leftArrowPressed = e.which === this.keyCodes.arrowLeft;
        const rightArrowPressed = e.which === this.keyCodes.arrowRight;

        if (backspacePressed || deletePressed) {

          e.preventDefault();

          this.deleteSelectedChip($chipsWrapper, $selectedChip, siblingsLength);

        } else if (leftArrowPressed) {

          this.selectLeftChip($chipsWrapper, $selectedChip);
        } else if (rightArrowPressed) {

          this.selectRightChip($chipsWrapper, $selectedChip, siblingsLength);
        }
      });
    }

    handleDocumentFocusIn() {

      let $chipsInput;
      const $chips = this.chips;

      if ($chips.hasClass('chips-autocomplete')) {

        $chipsInput = $chips.children().children('input');
      } else {

        $chipsInput = $chips.children('input');
      }

      $chipsInput.on('click', e => {

        const $target = $(e.target);

        $target.closest(this.selectors.chips).addClass('focus');
        $(this.selectors.chip).removeClass('selected');
        $target.addClass('active');
      });
    }

    handleDocumentFocusOut() {

      this.chips.on('focusout', 'input', e => $(e.target).closest(this.selectors.chips).removeClass('focus'));
    }

    handleDocumentKeyDownChipsInput() {

      this.chips.on('keydown', 'input', e => {

        const $target = $(e.target);
        const $chips = this.chips;
        const $chipsWrapper = $target.closest(this.selectors.chips);
        const chipsIndex = $chipsWrapper.data('index');
        const chipsLength = $chipsWrapper.children(this.selectors.chip).length;

        const enterPressed = e.which === this.keyCodes.enter;
        const commaPressed = e.which === this.keyCodes.comma;
        const leftArrowPressed = e.which === this.keyCodes.arrowLeft;
        const backspacePressed = e.which === this.keyCodes.backspace;

        if ((enterPressed || commaPressed) && !this.ulWrapper.find('li').hasClass('selected')) {

          e.preventDefault();

          this.addChip(
            chipsIndex, {
              tag: $target.val()
            },
            $chipsWrapper
          );

          $target.val('');

          return;
        }

        const leftArrowOrDeletePressed = e.keyCode === this.keyCodes.arrowLeft || e.keyCode === this.keyCodes.delete;
        const isValueEmpty = $target.val() === '';

        if (leftArrowOrDeletePressed && isValueEmpty && chipsLength) {

          this.selectChip(chipsIndex, chipsLength - 1, $chipsWrapper);

        }

        if (isValueEmpty && $(this.selectors.input).hasClass('active')) {

          if (leftArrowPressed) {

            this.selectChip(chipsIndex, chipsLength - 1, $chipsWrapper);
          }
        } else {

          $chips.find('.chip').removeClass('selected');
        }

        const $thisChips = $chips.find('.chip-position-wrapper').children('.chip');
        const $thisChipsLast = $chips.find('.chip-position-wrapper .chip').last().index();

        if (isValueEmpty && backspacePressed && (!$thisChips.hasClass('selected') || !$chips.find('.chip').hasClass('selected')) && $chips.hasClass('chips') && !$chips.hasClass('chips-initial') && !$chips.hasClass('chips-placeholder')) {
          this.deleteChip($chipsWrapper.data('index'), $thisChipsLast, $chipsWrapper);

        }

        if (isValueEmpty && backspacePressed && !$chips.find('.chip').hasClass('selected') && $chips.hasClass('chips') && ($chips.hasClass('chips-initial') || $chips.hasClass('chips-placeholder'))) {
          this.deleteChip($chipsWrapper.data('index'), $thisChipsLast, $chipsWrapper);
        }
      });
    }

    handleDocumentClickChipsDelete() {

      this.chips.on('click', '.chip .fas', e => {

        const $target = $(e.target);
        const $chip = $target.parent($(this.chips));

        let $chipsWrapper;

        if ($chip.parents().eq(1).hasClass('chips-autocomplete')) {

          $chipsWrapper = $chip.parents().eq(1);
        } else if (!$chip.parent().hasClass('chips-autocomplete') && !$chip.parents().eq(1).hasClass('chips-autocomplete')) {

          $chipsWrapper = $chip.parents().eq(0);
        } else if ($chip.parent().hasClass('chips-initial') && $chip.parent().hasClass('chips-autocomplete')) {

          $chipsWrapper = $chip.parents().eq(0);
        }

        this.deleteChip($chipsWrapper.data('index'), $chip.index(), $chipsWrapper);
        $chipsWrapper.find('input').focus();
      });
    }

    inputKeyDown() {

      const $ulWrapper = this.ulWrapper;
      const dataChip = this.options.dataChip;
      const $thisChips = this.chips;
      const $input = $thisChips.children('.chip-position-wrapper').children('input');

      $input.on('keyup', e => {

        const $inputValue = $input.val();
        $ulWrapper.empty();

        if ($inputValue.length) {

          for (const item in dataChip) {

            if (dataChip[item].toLowerCase().includes($inputValue.toLowerCase())) {

              $thisChips.children('.chip-position-wrapper').append($ulWrapper.append($(`<li>${dataChip[item]}</li>`)));
            }
          }
        }

        if (e.which === this.keyCodes.enter) {

          $ulWrapper.empty();
          $ulWrapper.remove();
        }

        $inputValue.length === 0 ? $ulWrapper.removeClass('active').hide() : $ulWrapper.addClass('active').show();
      });
    }

    dynamicInputChanges() {

      const dataChip = this.options.dataChip;

      if (dataChip !== undefined) {

        this.chips.children('.chip-position-wrapper').children('input').on('change', e => {

          const $targetVal = $(e.target).val();

          if (!dataChip.includes($targetVal)) {

            dataChip.push($targetVal);
            dataChip.sort();
          }
        });
      }
    }

    renderedLiClick() {

      this.chips.on('click', 'li', e => {

        e.preventDefault();

        const $target = $(e.target);
        const $chipsWrapper = $target.closest($(this.selectors.chips));
        const chipsIndex = $chipsWrapper.data('index');

        this.addChip(
          chipsIndex, {
            tag: $target.text()
          }, $chipsWrapper
        );

        this.chips.children('.chip-position-wrapper').children('input').val('');
        this.ulWrapper.remove();
      });
    }

    deleteSelectedChip($chipsWrapper, $selectedChip, siblingsLength) {

      const chipsIndex = $chipsWrapper.data('index');
      const chipIndex = $selectedChip.index();
      this.deleteChip(chipsIndex, chipIndex, $chipsWrapper);

      let selectIndex = null;

      if (chipIndex < siblingsLength - 1) {
        selectIndex = chipIndex;
      } else if (chipIndex === siblingsLength || chipIndex === siblingsLength - 1) {
        selectIndex = siblingsLength - 1;
      }

      if (selectIndex < 0) {
        selectIndex = null;
      }

      if (selectIndex !== null) {
        this.selectChip(chipsIndex, selectIndex, $chipsWrapper);
      }

      if (!siblingsLength) {
        $chipsWrapper.find('input').focus();
      }
    }

    selectLeftChip($chipsWrapper, $selectedChip) {

      const chipIndex = $selectedChip.index() - 1;
      if (chipIndex < 0) {
        return;
      }

      $(this.selectors.chip).removeClass('selected');

      this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
    }

    selectRightChip($chipsWrapper, $selectedChip, siblingsLength) {

      const chipIndex = $selectedChip.index() + 1;

      $(this.selectors.chip).removeClass('selected');
      if (chipIndex > siblingsLength) {

        $chipsWrapper.find('input').focus();
        return;
      }

      this.selectChip($chipsWrapper.data('index'), chipIndex, $chipsWrapper);
    }

    renderChips($chipsWrapper) {

      let html = '';

      $chipsWrapper.data('chips').forEach((elem) => {

        html += this.getSingleChipHtml(elem);
      });

      if ($chipsWrapper.hasClass('chips-autocomplete')) {

        html += '<span class="chip-position-wrapper position-relative"><input class="input" placeholder=""></span>';
      } else {

        html += '<input class="input" placeholder="">';
      }
      $chipsWrapper.html(html);

      this.setPlaceholder($chipsWrapper);
    }

    getSingleChipHtml(elem) {

      if (!elem.tag) {
        return '';
      }

      let html = `<div class="chip">${elem.tag}`;

      if (elem.image) {
        html += ` <img src="${elem.image}"> `;
      }

      html += '<i class="close fas fa-times"></i>';
      html += '</div>';

      return html;
    }

    setPlaceholder($chips) {

      const options = $chips.data('options');

      if ($chips.data('chips').length && options.placeholder) {

        $chips.find('input').prop('placeholder', options.placeholder);

      } else if (!$chips.data('chips').length && options.secondaryPlaceholder) {

        $chips.find('input').prop('placeholder', options.secondaryPlaceholder);
      }
    }

    isValid($chipsWrapper, elem) {

      const chips = $chipsWrapper.data('chips');

      for (let i = 0; i < chips.length; i++) {

        if (chips[i].tag === elem.tag) {

          return false;
        }
      }

      return elem.tag !== '';
    }

    addChip(chipsIndex, elem, $chipsWrapper) {

      if (!this.isValid($chipsWrapper, elem)) {
        return;
      }

      const $chipHtml = $(this.getSingleChipHtml(elem));

      $chipsWrapper.data('chips').push(elem);

      if ($chipsWrapper.hasClass('chips-autocomplete') && $chipsWrapper.hasClass('chips-initial') && $chipsWrapper.find('.chip').length > 0) {

        $chipHtml.insertAfter($chipsWrapper.find('.chip').last());
      } else {

        $chipHtml.insertBefore($chipsWrapper.find('input'));
      }

      $chipsWrapper.trigger('chip.add', elem);

      this.setPlaceholder($chipsWrapper);
    }

    deleteChip(chipsIndex, chipIndex, $chipsWrapper) {

      const chip = $chipsWrapper.data('chips')[chipIndex];

      $chipsWrapper.find('.chip').eq(chipIndex).remove();

      $chipsWrapper.data('chips').splice(chipIndex, 1);
      $chipsWrapper.trigger('chip.delete', chip);

      this.setPlaceholder($chipsWrapper);
    }

    selectChip(chipsIndex, chipIndex, $chipsWrapper) {

      const $chip = $chipsWrapper.find('.chip').eq(chipIndex);

      if ($chip && $chip.hasClass('selected') === false) {

        $chip.addClass('selected');
        $chipsWrapper.trigger('chip.select', $chipsWrapper.data('chips')[chipIndex]);
      }
    }

    getChipsElement(index, $chipsWrapper) {
      return $chipsWrapper.eq(index);
    }
  }

  $.fn.materialChip = function (options) {
    return this.each(function () {
      new MaterialChip($(this), options);
    });
  };

}(jQuery));
