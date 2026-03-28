import calendar
from datetime import date, timedelta

def find_next_occurrence(start: date, repeat: str, now: date) -> date:
    if start >= now:
        return start
    if repeat == "daily":
        days = (now - start).days + 1
        return start + timedelta(days=days)
    if repeat == "weekly":
        weeks = (now - start).days // 7 + 1
        return start + timedelta(weeks=weeks)
    if repeat == "monthly":
        months = (now.year - start.year) * 12 + (now.month - start.month)
        year = start.year + (start.month - 1 + months) // 12
        month = (start.month - 1 + months) % 12 + 1
        day = min(start.day, calendar.monthrange(year, month)[1])
        candidate = start.replace(year=year, month=month, day=day)
        if candidate < now:
            months += 1
            year = start.year + (start.month - 1 + months) // 12
            month = (start.month - 1 + months) % 12 + 1
            day = min(start.day, calendar.monthrange(year, month)[1])
            candidate = start.replace(year=year, month=month, day=day)
        return candidate
    return start