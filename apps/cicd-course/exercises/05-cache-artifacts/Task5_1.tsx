// Task 5.1: Artifacts — pipeline data flow
// Задание 5.1: Artifacts — передача данных между джобами

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define artifact path options
// Определи варианты путей для артефактов:
// { id: string, label: string, desc: string }[]
// Минимум 4 варианта: dist/, reports/, public/, coverage/
const ARTIFACT_PATHS: { id: string; label: string; desc: string }[] = [
  // TODO: заполни массив
]

// TODO: Define expire_in options
// Варианты времени хранения: '1 hour', '1 day', '1 week', 'never'
const EXPIRE_OPTIONS: string[] = []

// TODO: Define when options
// { value: string, label: string, desc: string }[]
// Значения: on_success, on_failure, always
const WHEN_OPTIONS: { value: string; label: string; desc: string }[] = []

// TODO: Implement buildArtifactsYaml
// Принимает: paths (string[]), expireIn (string), when (string)
// Возвращает: строку YAML конфига для секции artifacts
function buildArtifactsYaml(_paths: string[], _expireIn: string, _when: string): string {
  // TODO: собери YAML-строку с paths, expire_in и when
  return ''
}

export function Task5_1() {
  const { t } = useLanguage()
  // TODO: Add state for selectedPaths (string[]), expireIn (string), when (string)
  const [selectedPaths, setSelectedPaths] = useState<string[]>(['dist/'])
  const [expireIn, setExpireIn] = useState('1 week')
  const [when, setWhen] = useState('on_success')

  // TODO: Implement togglePath — добавляет/удаляет путь из selectedPaths
  const togglePath = (_label: string) => {
    // TODO
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.5.1')}</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        {t('task.5.1.subtitle')}
      </p>

      {/* TODO: Pipeline visualization */}
      {/* Отобрази три блока: Build → Test → Deploy */}
      {/* Между блоками — стрелки с названием артефакта */}
      {/* При when === 'on_failure' — подсвети build-блок красным */}

      {/* TODO: Warning banner for on_failure */}
      {/* Если when === 'on_failure', показать информационную плашку */}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Settings panel */}
        <div style={{ flex: '1 1 280px' }}>
          {/* TODO: artifacts:paths — чекбоксы */}
          {/* Для каждого пути из ARTIFACT_PATHS — чекбокс */}
          {/* При изменении — вызывать togglePath */}

          {/* TODO: artifacts:expire_in — кнопки */}
          {/* Для каждого варианта из EXPIRE_OPTIONS — кнопка */}
          {/* Активная кнопка выделяется цветом */}
          {/* При клике — setExpireIn(opt) */}

          {/* TODO: artifacts:when — кнопки */}
          {/* Для каждого варианта из WHEN_OPTIONS — кнопка с описанием */}
          {/* Активная кнопка выделяется */}
          {/* При клике — setWhen(opt.value) */}

          {/* Placeholder чтобы компонент компилировался */}
          <div style={{ color: '#aaa' }}>
            selectedPaths: {selectedPaths.join(', ')} | expireIn: {expireIn} | when: {when}
          </div>
        </div>

        {/* TODO: YAML output */}
        {/* <pre> с тёмным фоном */}
        {/* Содержимое: buildArtifactsYaml(selectedPaths, expireIn, when) */}
        {/* Обновляется при каждом изменении настроек */}
        <div style={{ flex: '1 1 280px', color: '#aaa' }}>
          YAML будет здесь
        </div>
      </div>
    </div>
  )
}
