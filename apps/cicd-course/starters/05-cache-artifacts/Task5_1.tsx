// Task 5.1: Artifacts — pipeline data flow
// Задание 5.1: Artifacts — передача данных между джобами

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// TODO: Define artifact path options
// Определи варианты путей для артефактов:
// { id: string, label: string, desc: string }[]
// Минимум 4 варианта: dist/, reports/, public/, coverage/
const ARTIFACT_PATHS: { id: string; label: string; desc: string }[] = [
  // TODO: fill in the array
  // Заполни массив
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
// Accepts: paths (string[]), expireIn (string), when (string)
// Returns: YAML config string for the artifacts section
function buildArtifactsYaml(_paths: string[], _expireIn: string, _when: string): string {
  // TODO: build YAML string with paths, expire_in and when
  // TODO: собери YAML-строку с paths, expire_in и when
  return ''
}

export function Task5_1() {
  const { t } = useLanguage()
  // TODO: Add state for selectedPaths (string[]), expireIn (string), when (string)
  const [selectedPaths, setSelectedPaths] = useState<string[]>(['dist/'])
  const [expireIn, setExpireIn] = useState('1 week')
  const [when, setWhen] = useState('on_success')

  // TODO: Implement togglePath — adds/removes path from selectedPaths
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
      {/* Display three blocks: Build → Test → Deploy */}
      {/* Between blocks — arrows with artifact name */}
      {/* When when === 'on_failure' — highlight build block in red */}

      {/* TODO: Warning banner for on_failure */}
      {/* Если when === 'on_failure', показать информационную плашку */}
      {/* If when === 'on_failure', show an info banner */}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Settings panel */}
        <div style={{ flex: '1 1 280px' }}>
          {/* TODO: artifacts:paths — checkboxes */}
          {/* TODO: artifacts:paths — чекбоксы */}
          {/* For each path in ARTIFACT_PATHS — a checkbox */}
          {/* Для каждого пути из ARTIFACT_PATHS — чекбокс */}
          {/* On change — call togglePath */}
          {/* При изменении — вызывать togglePath */}

          {/* TODO: artifacts:expire_in — buttons */}
          {/* TODO: artifacts:expire_in — кнопки */}
          {/* For each option in EXPIRE_OPTIONS — a button */}
          {/* Для каждого варианта из EXPIRE_OPTIONS — кнопка */}
          {/* Active button is highlighted with color */}
          {/* Активная кнопка выделяется цветом */}
          {/* On click — setExpireIn(opt) */}
          {/* При клике — setExpireIn(opt) */}

          {/* TODO: artifacts:when — buttons */}
          {/* TODO: artifacts:when — кнопки */}
          {/* For each option in WHEN_OPTIONS — a button with description */}
          {/* Для каждого варианта из WHEN_OPTIONS — кнопка с описанием */}
          {/* Active button is highlighted */}
          {/* Активная кнопка выделяется */}
          {/* On click — setWhen(opt.value) */}
          {/* При клике — setWhen(opt.value) */}

          {/* Placeholder so the component compiles */}
          {/* Placeholder чтобы компонент компилировался */}
          <div style={{ color: '#aaa' }}>
            selectedPaths: {selectedPaths.join(', ')} | expireIn: {expireIn} | when: {when}
          </div>
        </div>

        {/* TODO: YAML output */}
        {/* YAML output */}
        {/* <pre> with dark background */}
        {/* <pre> с тёмным фоном */}
        {/* Content: buildArtifactsYaml(selectedPaths, expireIn, when) */}
        {/* Содержимое: buildArtifactsYaml(selectedPaths, expireIn, when) */}
        {/* Updates on every settings change */}
        {/* Обновляется при каждом изменении настроек */}
        <div style={{ flex: '1 1 280px', color: '#aaa' }}>
          YAML будет здесь
        </div>
      </div>
    </div>
  )
}
