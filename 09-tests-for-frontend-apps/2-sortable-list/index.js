export default class SortableList {

   onMoveElem = (event) => {

      const target = event.target.closest('[data-grab-handle]');

      if (target) {

         const movingItem = event.target.closest('.sortable-list__item');

         movingItem.classList.add('sortable-list__placeholder')

         const shiftX = event.clientX - movingItem.getBoundingClientRect().left + movingItem.parentNode.getBoundingClientRect().left;
         const shiftY = event.clientY - movingItem.getBoundingClientRect().top + movingItem.parentNode.getBoundingClientRect().top;

         const hightOfMovingItem = movingItem.offsetHeight;
         const widthOfMovingItem = movingItem.offsetWidth;

         movingItem.style.width = widthOfMovingItem + 'px'
         movingItem.style.height = hightOfMovingItem + 'px'

         movingItem.classList.add('to-move')

         const placeholder = this.getPlaceholder(widthOfMovingItem, hightOfMovingItem);

         movingItem.after(placeholder)

         movingItem.parentNode.append(movingItem)

         moveAt(event.clientX, event.clientY);

         function moveAt(pageX, pageY) {

            movingItem.style.left = pageX - shiftX + 'px';
            movingItem.style.top = pageY - shiftY + 'px';
         }

         function onMouseMove(event) {

            moveAt(event.pageX, event.pageY);

            movingItem.classList.add('hide');

            const elemBelow = document.elementFromPoint(event.clientX, event.clientY);

            movingItem.classList.remove('hide')

            const droppableBelow = elemBelow.closest('.sortable-list__item');

            if (droppableBelow) {

               if (droppableBelow.nextSibling && droppableBelow.nextSibling.closest('.placeholder')) {

                  droppableBelow.before(placeholder)
               } else {
                  droppableBelow.after(placeholder)
               }
            }
         }

         function onPointerUp() {

            placeholder.replaceWith(movingItem)

            movingItem.style.left = 'auto';
            movingItem.style.top = 'auto';

            movingItem.classList.remove('to-move')
            movingItem.classList.remove('sortable-list__placeholder')
         }

         document.addEventListener('pointermove', onMouseMove);

         document.addEventListener('pointerup', onPointerUp);

         document.addEventListener('pointerup', function handler() {

            document.removeEventListener('pointermove', onMouseMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointerup', handler);

            movingItem.onmouseup = null;
         })
      }
   }

   onRemoveItemByClick = (event) => {

      const target = event.target.closest('[data-delete-handle]')

      if (target) {

         target.closest('.sortable-list__item').remove()

      }
   }

   constructor({ items = [] } = {}) {

      this.items = items

      this.render()
      this.initEventListeners()
   }

   render() {

      const element = document.createElement('ul');

      element.classList.add('sortable-list');

      this.element = element;

      for (const item of this.items) {

         item.classList.add('sortable-list__item');

         this.element.append(item)
      }

   }
   getPlaceholder(width, hight) {

      const placeholder = document.createElement('li');

      placeholder.classList.add('sortable-list__placeholder')
      placeholder.classList.add('placeholder')

      placeholder.style.width = width + 'px'
      placeholder.style.height = hight + 'px'

      return placeholder;
   }

   initEventListeners() {
      this.element.addEventListener('pointerdown', this.onMoveElem)
      this.element.addEventListener('pointerdown', this.onRemoveItemByClick)

   }
   removeEventListeners() {
      this.element.removeEventListener('pointerdown', this.onMouseDown);
      this.element.removeEventListener('pointerdown', this.onRemoveItemByClick);
   }

   remove() {
      this.element.remove();
   }

   destroy() {
      this.removeEventListeners();
      this.remove();
   }

}