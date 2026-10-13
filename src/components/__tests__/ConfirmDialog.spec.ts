import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '../ConfirmDialog.vue'

// jsdom has no modal dialog
HTMLDialogElement.prototype.showModal = function () {
  this.open = true
}
HTMLDialogElement.prototype.close = function () {
  this.open = false
  this.dispatchEvent(new Event('close'))
}

function mountDialog() {
  return mount(ConfirmDialog, {
    props: { message: 'Delete 82.4 kg from 1 Oct 2026?', confirmLabel: 'Delete' },
    attachTo: document.body,
  })
}

function button(wrapper: ReturnType<typeof mountDialog>, text: string) {
  return wrapper.findAll('button').find((b) => b.text() === text)!
}

describe('ConfirmDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('opens as a modal with the question', () => {
    const wrapper = mountDialog()

    expect(wrapper.find<HTMLDialogElement>('dialog').element.open).toBe(true)
    expect(wrapper.text()).toContain('Delete 82.4 kg from 1 Oct 2026?')
  })

  it('emits confirm', async () => {
    const wrapper = mountDialog()

    await button(wrapper, 'Delete').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('emits cancel on Cancel', async () => {
    const wrapper = mountDialog()

    await button(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('emits cancel when closed another way', () => {
    const wrapper = mountDialog()

    wrapper.find<HTMLDialogElement>('dialog').element.close()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('emits cancel on a backdrop click', async () => {
    const wrapper = mountDialog()

    await wrapper.find('dialog').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
